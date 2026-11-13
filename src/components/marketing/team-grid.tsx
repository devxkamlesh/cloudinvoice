"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import type { TeamMember } from "@/lib/marketing-content";

// Photo with an initials fallback: if the image file isn't present yet (or fails to
// load), we show the member's initials instead of a broken image. This lets the team
// section ship before every headshot is added.
function Avatar({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);

  if (!member.photo || failed) {
    return (
      <div
        aria-label={`${member.name} photo placeholder`}
        className="grid size-16 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-semibold text-primary"
      >
        {member.initials}
      </div>
    );
  }

  const isKavita = member.name === "Kavita Kumari";

  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
      <Image
        src={member.photo}
        alt={member.name}
        width={64}
        height={64}
        className={isKavita ? "absolute -left-[27px] -top-[9px] size-24 max-w-none object-cover" : "size-full object-cover"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((member) => (
        <article key={`${member.name}-${member.role}`} className="marketing-card rounded-xl p-6">
          <div className="flex items-center gap-4">
            <Avatar member={member} />
            <div>
              <h3 className="text-lg font-semibold tracking-[-.02em]">{member.name}</h3>
              <p className="text-sm font-medium text-primary">{member.role}</p>
            </div>
          </div>
          {member.bio && <p className="mt-5 text-sm leading-7 text-muted-foreground">{member.bio}</p>}
          {member.linkedin && (
            <Link
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="marketing-link mt-5 inline-flex items-center gap-2 text-sm font-semibold"
              aria-label={`${member.name}, ${member.role} on LinkedIn`}
            >
              <Linkedin className="size-4" /> LinkedIn
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
