import "server-only";

type DiscordEmbed = {
  title: string;
  description?: string;
  color?: number;
  url?: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
};

/** Discord rejects field values over 1024 chars and empty ones. */
function clean(value: string, max = 1024) {
  const v = value.trim() || "-";
  return v.length > max ? `${v.slice(0, max - 1)}…` : v;
}

/**
 * Post an embed to the admin Discord channel (`DISCORD_WEBHOOK`).
 *
 * Notifications are best-effort: a missing env var or a Discord outage is
 * logged and swallowed so the user's request still succeeds.
 */
export async function notifyDiscord(embed: DiscordEmbed) {
  const url = process.env.DISCORD_WEBHOOK;
  if (!url) {
    console.warn("[discord] DISCORD_WEBHOOK is not set; skipping notification");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Freedom",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            ...embed,
            title: clean(embed.title, 256),
            description: embed.description ? clean(embed.description, 4000) : undefined,
            fields: embed.fields?.map((f) => ({ ...f, name: clean(f.name, 256), value: clean(f.value) })),
            timestamp: embed.timestamp ?? new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[discord] webhook failed", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[discord] webhook error", err);
  }
}
