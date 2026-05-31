import { Megaphone, MessageSquare, Radio, Trophy } from "lucide-react";
import { relativeFeedTime } from "@/lib/date-format";
import type { FeedPost, FeedPostType } from "@/lib/types";

const icons: Record<FeedPostType, typeof Megaphone> = {
  announcement: Megaphone,
  final_score: Trophy,
  score_update: Radio,
  standings_update: Trophy,
  smack: MessageSquare
};

export function FeedList({ posts }: { posts: FeedPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-slate-500">
        No tournament updates yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => {
        const Icon = icons[post.type];

        return (
          <article
            key={post.id}
            className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-floorbs">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-black leading-tight text-ink">{post.title}</h3>
                <span className="shrink-0 text-xs font-semibold text-slate-400">
                  {relativeFeedTime(post.created_at)}
                </span>
              </div>
              {post.body ? (
                <p className="mt-1 text-sm leading-5 text-slate-600">{post.body}</p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
