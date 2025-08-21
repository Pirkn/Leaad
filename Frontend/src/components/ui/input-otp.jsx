import * as React from "react";

function InputOTP({ value, onChange, maxLength = 6, className = "" }) {
  const inputRefs = React.useRef([]);
  const [otp, setOtp] = React.useState(value || "");

  React.useEffect(() => {
    setOtp(value || "");
  }, [value]);

  const handleChange = (index, newValue) => {
    if (newValue.length > 1) return; // Prevent multiple characters

    const newOtp = otp.split("");
    newOtp[index] = newValue;
    const finalOtp = newOtp.join("");

    setOtp(finalOtp);
    onChange?.(finalOtp);

    // Auto-focus next input
    if (newValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, maxLength);
    if (/^\d+$/.test(pastedData)) {
      setOtp(pastedData);
      onChange?.(pastedData);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, maxLength - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length: maxLength }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-colors"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

function InputOTPGroup({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function InputOTPSlot({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
