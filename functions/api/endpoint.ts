interface IEnv {
  BOT_TOKEN: string; // Get it from @BotFather https://core.telegram.org/bots#6-botfather
  BOT_SECRET: string; // A-Z, a-z, 0-9, _ and -
}

const botFullDescription = `Sequence Tap Dance is a demo of a Telegram app that uses Sequence to authenticate users. The source code for the telegram bot and the webapp are available at https://github.com/0xsequence/telegram-kit-embedded-wallet-react-boilerplate`;

/**
 * Return url to telegram api, optionally with parameters added
 */
export const onRequest: PagesFunction<IEnv> = async (ctx) => {
  // Check secret
  if (
    ctx.request.headers.get("X-Telegram-Bot-Api-Secret-Token") !==
    ctx.env.BOT_SECRET
  ) {
    return new Response("Unauthorized", { status: 403 });
  }

  const requestUrl = new URL(ctx.request.url);
  const webappUrl = `${requestUrl.protocol}//${requestUrl.hostname}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: any = await ctx.request.json();

  if ("inline_query" in update) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ilq = update.inline_query as any;

    const params = {
      inline_query_id: ilq.id,
      button: JSON.stringify({
        text: "Quick Play In Mini-Mode!",
        web_app: {
          url: webappUrl,
        },
      }),
      results: JSON.stringify(
        [
          {
            type: "game",
            id: "game",
            game_short_name: "tap_dance",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    callback_game: {},
                  },
                  {
                    text: "Learn more",
                    url: `https://t.me/sequence_tests_bot`,
                  },
                ],
              ],
            },
          },
        ].filter((p) => p.id.startsWith(ilq.query) || ilq.query === "all"),
      ),
    };
    const r: { ok: boolean } = await (
      await fetch(apiUrl(ctx.env.BOT_TOKEN, "answerInlineQuery", params))
    ).json();
    return new Response("ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2));
  } else if ("callback_query" in update) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cbq = update.callback_query as any;
    if ("game_short_name" in cbq) {
      const r: { ok: boolean } = await (
        await fetch(
          apiUrl(ctx.env.BOT_TOKEN, "answerCallbackQuery", {
            callback_query_id: cbq.id,
            url: webappUrl,
          }),
        )
      ).json();
      return new Response(
        "ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2),
      );
    } else if ("data" in cbq) {
      if (cbq.data === "more-info") {
        const msgUrl = apiUrl(ctx.env.BOT_TOKEN, "sendMessage", {
          chat_id: cbq.from.id,
          text: botFullDescription,
        });
        await fetch(msgUrl);

        const r: { ok: boolean } = await (
          await fetch(
            apiUrl(ctx.env.BOT_TOKEN, "answerCallbackQuery", {
              callback_query_id: cbq.id,
              text: botFullDescription,
            }),
          )
        ).json();
        return new Response(
          "ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2),
        );
      }
    }
  } else if ("message" in update) {
    let url = "";
    if (/\/init/.test(update.message.text)) {
      url = apiUrl(ctx.env.BOT_TOKEN, "setChatMenuButton", {
        chat_id: update.message.chat.id,
        menu_button: JSON.stringify({
          type: "web_app",
          text: "Play",
          web_app: {
            url: webappUrl,
          },
        }),
      });
    } else if (/\/start/.test(update.message.text)) {
      url = apiUrl(ctx.env.BOT_TOKEN, "sendAnimation", {
        chat_id: update.message.chat.id,
        animation: `${webappUrl}/640.gif`,
        thumbnail: `${webappUrl}/happy.jpeg`,
        caption:
          "Play Sequence Tap Dance to see how Sequence integrates with Telegram Webapps",
        show_caption_above_media: "True",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              {
                text: "Play Now",
                web_app: {
                  url: webappUrl,
                },
              },
            ],
            [
              {
                text: "Share",
                switch_inline_query_chosen_chat: {
                  query: "",
                  allow_user_chats: true,
                  allow_group_chats: true,
                },
              },
              {
                text: "More Info",
                callback_data: "more-info",
              },
            ],
          ],
        }),
      });
    }
    const r: { ok: boolean } = await (await fetch(url)).json();
    return new Response("ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2));
  } else {
    return new Response(
      JSON.stringify({ result: "no message in update" }, null, 2),
    );
  }
};

/**
 * Return url to telegram api, optionally with parameters added
 */
function apiUrl(
  botToken: string,
  methodName: string,
  params: Record<string, string>,
) {
  let query = "";
  if (params) {
    query = "?" + new URLSearchParams(params).toString();
  }
  return `https://api.telegram.org/bot${botToken}/${methodName}${query}`;
}
