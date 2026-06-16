import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";
import logo from "@/assets/logo.png";

export function LoginScreen() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setError("");
    setLoading(true);
    try {
      await login(password);
    } catch (err: any) {
      // If it's the specific "not configured" error, show that to help debugging
      if (err.message?.includes("not configured")) {
        setError("Error: " + err.message);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[oklch(0.97_0.02_75)] via-background to-[oklch(0.95_0.04_145)] px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm">
          {/* Logo & brand */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-md ring-1 ring-border/40">
              <img src={logo} alt="Aahar Jeevan" className="h-16 w-16 object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[var(--dark-green)]">Aahar Jeevan</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">Nutritionist Workspace</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="password" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading || !password.trim()}>
              {loading ? (
                <span className="animate-pulse">Verifying...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Shobhana Thakkar · Internationally Certified Nutritionist
        </p>
      </div>
    </div>
  );
}
