import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";

const LeadsContext = createContext({
  newlyGeneratedLeads: [],
  addNewlyGeneratedLeads: () => {},
  clearNewlyGeneratedLeads: () => {},
  // realtime + offline awareness
  isLeadNew: (_id) => false,
  unseenNewLeadCount: 0,
  acknowledgeNewLeads: () => {},
  simulateNewLead: (_partial) => {},
});

export const useLeadsContext = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeadsContext must be used within a LeadsProvider");
  }
  return context;
};

export const LeadsProvider = ({ children }) => {
  const { user } = useAuth();
  const [newlyGeneratedLeads, setNewlyGeneratedLeads] = useState([]);
  const [newLeadIds, setNewLeadIds] = useState(new Set());
  const [unseenNewLeadCount, setUnseenNewLeadCount] = useState(0);
  const hasHydratedOffline = useRef(false);

  const localStorageKeys = useMemo(() => {
    const userId = user?.id || "anon";
    return {
      lastSeenAt: `leads:lastSeenAt:${userId}`,
    };
  }, [user]);

  const dedupeById = (incoming) => {
    return (prev) => {
      const existing = new Map(prev.map((l) => [l.id, l]));
      for (const lead of incoming) {
        if (lead && lead.id != null && !existing.has(lead.id)) {
          existing.set(lead.id, lead);
        }
      }
      // Keep newest first
      return Array.from(existing.values()).sort((a, b) => {
        const aDate = new Date(a.date || a.created_at || 0).getTime();
        const bDate = new Date(b.date || b.created_at || 0).getTime();
        return bDate - aDate;
      });
    };
  };

  const mapRowToLead = (row) => {
    if (!row) return row;
    return {
      id: row.id ?? row.lead_id ?? row.post_id ?? row.uuid,
      title: row.title ?? row.post_title ?? "Lead",
      author: row.author ?? row.username ?? row.user,
      subreddit: row.subreddit,
      selftext: row.selftext ?? row.body ?? row.text ?? "",
      date: row.date ?? row.created_at,
      created_at: row.created_at,
      score: row.score ?? 0,
      num_comments: row.num_comments ?? 0,
      url: row.url,
      comment: row.comment,
      read: row.read ?? false,
    };
  };

  const addNewlyGeneratedLeads = (leads) => {
    if (!Array.isArray(leads) || leads.length === 0) return;
    setNewlyGeneratedLeads(dedupeById(leads));
  };

  const clearNewlyGeneratedLeads = () => {
    setNewlyGeneratedLeads([]);
  };

  const isLeadNew = (leadId) => newLeadIds.has(leadId);

  const acknowledgeNewLeads = () => {
    // Reset badge count but keep highlight tags for this session
    setUnseenNewLeadCount(0);
    try {
      localStorage.setItem(
        localStorageKeys.lastSeenAt,
        new Date().toISOString()
      );
    } catch (e) {
      // ignore storage errors
    }
  };

  const simulateNewLead = (partial = {}) => {
    const now = new Date();
    const id = partial.id ?? `sim-${now.getTime()}`;
    const lead = mapRowToLead({
      id,
      title: partial.title ?? "Test lead about Reddit growth",
      author: partial.author ?? "tester",
      subreddit: partial.subreddit ?? "marketing",
      selftext:
        partial.selftext ??
        "We're looking for tools to help automate outreach and lead discovery.",
      url: partial.url ?? "https://reddit.com/r/marketing",
      score: partial.score ?? 0,
      num_comments: partial.num_comments ?? 0,
      comment:
        partial.comment ??
        "Hey! We can help with hands-off Reddit lead discovery. Want details?",
      read: false,
      created_at: now.toISOString(),
      date: now.toISOString(),
    });

    addNewlyGeneratedLeads([lead]);
    setNewLeadIds((prev) => {
      const next = new Set(prev);
      next.add(lead.id);
      return next;
    });
    setUnseenNewLeadCount((c) => c + 1);
    toast(
      <div className="flex items-start">
        <CircleCheck className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-gray-900">
            New lead found!
          </div>
          {lead.title && (
            <div className="text-xs text-gray-700">{lead.title}</div>
          )}
        </div>
      </div>,
      {
        duration: 2000,
      }
    );
  };

  useEffect(() => {
    if (!user) return;

    // On first auth load, hydrate any leads that arrived while user was away
    if (hasHydratedOffline.current) return;

    const hydrate = async () => {
      hasHydratedOffline.current = true;
      let lastSeenAt = undefined;
      try {
        lastSeenAt = localStorage.getItem(localStorageKeys.lastSeenAt);
      } catch (e) {
        // ignore storage errors
      }

      if (!lastSeenAt) {
        // First time, initialize last seen to now
        try {
          localStorage.setItem(
            localStorageKeys.lastSeenAt,
            new Date().toISOString()
          );
        } catch (e) {}
        return;
      }

      try {
        const { data, error } = await supabase
          .from("active_leads")
          .select("*")
          .gt("created_at", lastSeenAt)
          .order("created_at", { ascending: false })
          .limit(200);

        if (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to hydrate offline leads:", error);
          return;
        }

        if (data && data.length > 0) {
          const leads = data.map(mapRowToLead).filter((l) => l?.id != null);
          addNewlyGeneratedLeads(leads);
          setNewLeadIds((prev) => {
            const next = new Set(prev);
            leads.forEach((l) => next.add(l.id));
            return next;
          });
          setUnseenNewLeadCount((c) => c + leads.length);

          toast(
            <div className="flex items-start">
              <CircleCheck className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">{`${leads.length} new leads found!`}</div>
                <div className="text-xs text-gray-700">While you were away</div>
              </div>
            </div>,
            {
              duration: 3000,
            }
          );
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error hydrating offline leads:", e);
      }
    };

    hydrate();
  }, [user, localStorageKeys.lastSeenAt]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime:active_leads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "active_leads" },
        (payload) => {
          const lead = mapRowToLead(payload.new);
          if (!lead?.id) return;
          addNewlyGeneratedLeads([lead]);
          setNewLeadIds((prev) => {
            const next = new Set(prev);
            next.add(lead.id);
            return next;
          });
          setUnseenNewLeadCount((c) => c + 1);
          toast(
            <div className="flex items-start">
              <CircleCheck className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  New lead found!
                </div>
                {lead.title && (
                  <div className="text-xs text-gray-700">{lead.title}</div>
                )}
              </div>
            </div>,
            {
              duration: 2000,
            }
          );
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {}
    };
  }, [user]);

  return (
    <LeadsContext.Provider
      value={{
        newlyGeneratedLeads,
        addNewlyGeneratedLeads,
        clearNewlyGeneratedLeads,
        isLeadNew,
        unseenNewLeadCount,
        acknowledgeNewLeads,
        simulateNewLead,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};
