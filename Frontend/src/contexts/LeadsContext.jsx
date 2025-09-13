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
  simulateDemoLead: () => {},
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

  const simulateDemoLead = () => {
    const demoLeads = [
      {
        title: "Looking for marketing automation tools for SaaS",
        author: "startup_founder_23",
        subreddit: "SaaS",
        selftext:
          "We're a B2B SaaS startup and need help with lead generation. Currently doing everything manually but looking to scale. Any recommendations for tools that can help us find and engage with potential customers on Reddit?",
        url: "https://reddit.com/r/SaaS/comments/example1",
        score: 12,
        num_comments: 8,
        comment:
          "Hi! We specialize in automated Reddit lead discovery for B2B SaaS companies. Our AI finds relevant discussions and generates personalized responses. Would love to show you how we've helped similar startups scale their outreach. DM me for a demo!",
      },
      {
        title: "Best practices for Reddit marketing in 2024?",
        author: "marketing_manager_99",
        subreddit: "marketing",
        selftext:
          "Our team is exploring Reddit as a marketing channel but struggling with the manual process of finding relevant posts and crafting responses. What tools or strategies are you all using?",
        url: "https://reddit.com/r/marketing/comments/example2",
        score: 25,
        num_comments: 15,
        comment:
          "We've built an AI-powered system that automates Reddit lead discovery and response generation. It finds high-intent discussions and creates personalized replies that actually add value. Happy to share our approach - it's been a game-changer for our lead gen.",
      },
      {
        title: "How do you find potential customers on Reddit?",
        author: "entrepreneur_2024",
        subreddit: "entrepreneur",
        selftext:
          "I'm launching a new product and Reddit seems like a goldmine for customer discovery, but I'm spending hours manually searching through subreddits. There has to be a better way...",
        url: "https://reddit.com/r/entrepreneur/comments/example3",
        score: 18,
        num_comments: 12,
        comment:
          "We use AI to automatically monitor Reddit for relevant discussions and generate contextual responses. It's like having a team member dedicated to Reddit lead gen 24/7. The key is finding posts where people are actively seeking solutions. Want to see how it works?",
      },
      {
        title: "Reddit advertising vs organic engagement - what works?",
        author: "digital_marketer_1",
        subreddit: "digitalmarketing",
        selftext:
          "We've tried Reddit ads but the ROI isn't great. Thinking about switching to organic engagement but it's so time-consuming to find the right posts and write good responses. Any tools that can help streamline this?",
        url: "https://reddit.com/r/digitalmarketing/comments/example4",
        score: 31,
        num_comments: 22,
        comment:
          "Organic engagement definitely works better on Reddit, but you're right about the time investment. We've automated the entire process - our AI finds high-value discussions and crafts responses that feel natural. It's been much more effective than ads for us. Happy to share our setup!",
      },
      {
        title: "Lead generation strategies for B2B companies",
        author: "b2b_sales_pro",
        subreddit: "sales",
        selftext:
          "What are the most effective lead generation strategies you've used for B2B? We're looking to expand beyond LinkedIn and email outreach. Reddit seems promising but I'm not sure how to approach it systematically.",
        url: "https://reddit.com/r/sales/comments/example5",
        score: 14,
        num_comments: 9,
        comment:
          "Reddit is actually one of our top B2B lead sources now. The key is finding discussions where people are actively looking for solutions to problems your product solves. We use AI to monitor relevant subreddits and respond with helpful, non-salesy advice. Happy to walk you through our process!",
      },
    ];

    const randomLead = demoLeads[Math.floor(Math.random() * demoLeads.length)];
    const now = new Date();
    const id = `demo-${now.getTime()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const lead = mapRowToLead({
      id,
      title: randomLead.title,
      author: randomLead.author,
      subreddit: randomLead.subreddit,
      selftext: randomLead.selftext,
      url: randomLead.url,
      score: randomLead.score,
      num_comments: randomLead.num_comments,
      comment: randomLead.comment,
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
        simulateDemoLead,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};
