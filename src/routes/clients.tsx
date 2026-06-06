import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { PaymentStatus } from "@/lib/types";
import { Search } from "lucide-react";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Client List — Aahar Jeevan" },
      { name: "description", content: "Search, sort, and manage your nutrition clients." },
    ],
  }),
  component: ClientList,
});

const STATUS_FILTERS: ("All" | PaymentStatus)[] = ["All", "Done", "Pending", "Partial"];

function ClientList() {
  const { patients } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [sort, setSort] = useState<"name" | "date">("name");

  const rows = useMemo(() => {
    let list = patients.filter((p) =>
      (p.name + " " + p.contact).toLowerCase().includes(q.toLowerCase()),
    );
    if (status !== "All") list = list.filter((p) => p.paymentStatus === status);
    list = [...list].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : (b.lastPlanDate ?? "").localeCompare(a.lastPlanDate ?? ""),
    );
    return list;
  }, [patients, q, status, sort]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--dark-green)]">Client List</h1>
          <Button onClick={() => navigate({ to: "/" })}>Add Patient</Button>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "name" | "date")}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="name">Name</option>
              <option value="date">Last plan date</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Payment Status</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={
                "rounded-full px-3 py-1 text-sm transition " +
                (status === s
                  ? "bg-[var(--dark-green)] text-white"
                  : "bg-muted text-foreground hover:bg-muted/70")
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Current</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Last plan</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-border align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-orange)]/20 font-semibold text-[var(--accent-orange)]">
                          {p.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.age}</td>
                    <td className="px-4 py-3">{p.currentWeight} kg</td>
                    <td className="px-4 py-3">{p.targetWeight} kg</td>
                    <td className="px-4 py-3">{p.lastPlanDate ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.paymentStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 text-sm">
                        <Link
                          to="/planner/$patientId"
                          params={{ patientId: p.id }}
                          className="font-medium text-[var(--accent-orange)] hover:underline"
                        >
                          Edit Plan
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No clients match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cls =
    status === "Done"
      ? "bg-[var(--dark-green)] text-white"
      : status === "Pending"
        ? "bg-[var(--primary-orange)] text-white"
        : "bg-[var(--leaf-green)] text-white";
  return <Badge className={"rounded-full px-3 py-1 " + cls}>{status}</Badge>;
}