"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  UserPlus,
  Crown,
  Shield,
  Edit3,
  Trash2,
  Mail,
  Copy,
  Check,
  Loader2,
  User,
  X,
} from "lucide-react";
import Link from "next/link";

const dummyMembers = [
  { id: "1", name: "Varun Hari", email: "varun@designforge.ai", role: "owner" as const, joined: "2025-01-15" },
  { id: "2", name: "Alex Chen", email: "alex@designforge.ai", role: "admin" as const, joined: "2025-03-01" },
  { id: "3", name: "Sarah Kim", email: "sarah@designforge.ai", role: "editor" as const, joined: "2025-04-10" },
  { id: "4", name: "Mike Johnson", email: "mike@designforge.ai", role: "viewer" as const, joined: "2025-05-20" },
];

const roleBadges = {
  owner: { label: "Owner", color: "text-accent bg-accent/10 border-accent/20", icon: Crown },
  admin: { label: "Admin", color: "text-primary bg-primary/10 border-primary/20", icon: Shield },
  editor: { label: "Editor", color: "text-secondary bg-secondary/10 border-secondary/20", icon: Edit3 },
  viewer: { label: "Viewer", color: "text-muted-foreground bg-card border-border/50", icon: User },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  const members = dummyMembers;
  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    setTimeout(() => {
      setInviting(false);
      setShowInvite(false);
      setInviteEmail("");
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://designforge.ai/join/team-abc123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and permissions.</p>
        </div>
        <Button variant="gradient" onClick={() => setShowInvite(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {members.length} member{members.length !== 1 ? "s" : ""}
        </div>
      </motion.div>

      {showInvite && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass border border-border/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Invite Team Member</h3>
            <button onClick={() => setShowInvite(false)} className="p-1 rounded-lg hover:bg-card text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Email address"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                className="h-10 rounded-lg bg-card border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <Button type="submit" variant="gradient" loading={inviting}>
                {inviting ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </form>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Or share invite link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="https://designforge.ai/join/team-abc123"
                className="flex-1 h-10 px-3 rounded-lg bg-card border border-border text-xs text-muted-foreground"
              />
              <Button variant="secondary" size="sm" onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={containerVariants} className="space-y-3">
        {filtered.map((member) => {
          const roleInfo = roleBadges[member.role];
          const RoleIcon = roleInfo.icon;
          return (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="rounded-xl glass border border-border/50 p-4 flex items-center gap-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shrink-0">
                {getInitials(member.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>
              <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", roleInfo.color)}>
                <RoleIcon className="w-3 h-3" />
                {roleInfo.label}
              </div>
              {member.role !== "owner" && (
                <button className="p-1.5 rounded-lg hover:bg-card text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
