interface IEnv {
  BOT_TOKEN: string; // Get it from @BotFather https://core.telegram.org/bots#6-botfather
  BOT_SECRET: string; // A-Z, a-z, 0-9, _ and -
}

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: any = await ctx.request.json();

  if ("inline_query" in update) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ilc = update.inline_query as any;

    const requestUrl = new URL(ctx.request.url);
    const responseData = {
      inline_query_id: ilc.id,
      results: JSON.stringify(
        [
          {
            type: "game",
            id: "game1",
            game_short_name: "tap_dance",
          },
          {
            type: "gif",
            id: "gif1",
            title: "Play against a friend",
            caption: "Play against a friend2",
            // input_message_content: {
            //   message_text:  "I challenge you to a game of Tap Dance!"
            // },
            // reply_markup	InlineKeyboardMarkup	Optional. Inline keyboard attached to the message
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            gif_url: `${requestUrl.protocol}//${requestUrl.hostname}/640.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "gif",
            id: "gif2",
            title: "Play against a friend",
            caption: "Play against a friend2",
            input_message_content: {
              message_text: "I challenge you to a game of Tap Dance! (gif)",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    url: `${requestUrl.protocol}//${requestUrl.hostname}`,
                  },
                ],
              ],
            },
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            gif_url: `${requestUrl.protocol}//${requestUrl.hostname}/640.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "gif",
            id: "gif3",
            title: "Play against a friend",
            caption: "Play against a friend3",
            // input_message_content: {
            //   message_text: "I challenge you to a game of Tap Dance! (gif)",
            // },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    switch_inline_query_current_chat: "",
                  },
                ],
              ],
            },
            // reply_markup	InlineKeyboardMarkup	Optional. Inline keyboard attached to the message
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            gif_url: `${requestUrl.protocol}//${requestUrl.hostname}/640.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "gif",
            id: "gif4",
            title: "Play against a friend",
            caption: "Play against a friend4",
            // input_message_content: {
            //   message_text: "I challenge you to a game of Tap Dance! (gif)",
            // },
            // reply_markup	InlineKeyboardMarkup	Optional. Inline keyboard attached to the message
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            gif_url: `${requestUrl.protocol}//${requestUrl.hostname}/640.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "gif",
            id: "gif5",
            title: "Play against a friend",
            caption: "Play against a friend5",
            // input_message_content: {
            //   message_text: "I challenge you to a game of Tap Dance! (gif)",
            // },
            // reply_markup	InlineKeyboardMarkup	Optional. Inline keyboard attached to the message
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            gif_url: `${requestUrl.protocol}//${requestUrl.hostname}/640.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "gif",
            id: "gif6",
            title: "Play against a friend",
            caption: "Play against a friend6",
            // input_message_content: {
            //   message_text: "I challenge you to a game of Tap Dance! (gif)",
            // },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    switch_inline_query_current_chat: "",
                  },
                ],
              ],
            },
            // reply_markup	InlineKeyboardMarkup	Optional. Inline keyboard attached to the message
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            gif_url: `${requestUrl.protocol}//${requestUrl.hostname}/640.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "article",
            id: "art1",
            title: "Play against a friend1",
            input_message_content: {
              message_text: "I challenge you to a game of Tap Dance!1",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    url: `${requestUrl.protocol}//${requestUrl.hostname}`,
                  },
                  {
                    text: "Play2",
                    web_app: {
                      url: `${requestUrl.protocol}//${requestUrl.hostname}`,
                    },
                  },
                ],
              ],
            },
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/happy.png`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "article",
            id: "art2",
            title: "Play against a friend2",
            input_message_content: {
              message_text: "I challenge you to a game of Tap Dance!2",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play2",
                    web_app: JSON.stringify({
                      url: `${requestUrl.protocol}//${requestUrl.hostname}`,
                    }),
                  },
                ],
              ],
            },
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/happy.png`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "article",
            id: "art3",
            title: "Play against a friend3",
            input_message_content: {
              message_text: "I challenge you to a game of Tap Dance!3",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play2",
                    web_app: {
                      url: `${requestUrl.protocol}//${requestUrl.hostname}`,
                    },
                  },
                ],
              ],
            },
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/happy.png`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "article",
            id: "art4",
            title: "Play against a friend4",
            input_message_content: {
              message_text: "I challenge you to a game of Tap Dance!4",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    url: `${requestUrl.protocol}//${requestUrl.hostname}`,
                  },
                ],
              ],
            },
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/happy.png`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "article",
            id: "art5",
            title: "Play against a friend5",
            input_message_content: {
              message_text: "I challenge you to a game of Tap Dance!5",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    switch_inline_query_current_chat: "",
                  },
                ],
              ],
            },
            // reply_markup	InlineKeyboardMarkup	Optional. Inline keyboard attached to the message
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description3",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
          {
            type: "article",
            id: "art6",
            title: "Play against a friend6",
            input_message_content: {
              message_text: "I challenge you to a game of Tap Dance!6",
            },
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Play",
                    switch_inline_query_chosen_chat: {
                      query: "",
                      allow_user_chats: true,
                      allow_group_chats: true,
                    },
                  },
                ],
              ],
            },
            // reply_markup	InlineKeyboardMarkup	Optional. Inline keyboard attached to the message
            url: `${requestUrl.protocol}//${requestUrl.hostname}`,
            hide_url: true,
            description: "test description3",
            thumbnail_url: `${requestUrl.protocol}//${requestUrl.hostname}/320.gif`,
            // thumbnail_width	Integer	Optional. Thumbnail width
            // thumbnail_height	Integer	Optional. Thumbnail height
          },
        ].filter((p) => p.id.startsWith(ilc.query) || ilc.query === "all"),
      ),
      button: JSON.stringify({
        text: "Play In Mini-Mode!",
        web_app: {
          url: `${requestUrl.protocol}//${requestUrl.hostname}`,
        },
      }),
    };
    const r: { ok: boolean } = await (
      await fetch(apiUrl(ctx.env.BOT_TOKEN, "answerInlineQuery", responseData))
    ).json();
    return new Response("ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2));
  } else if ("callback_query" in update) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qbc = update.callback_query as any;
    if ("game_short_name" in qbc) {
      const requestUrl = new URL(ctx.request.url);
      const responseData = {
        callback_query_id: qbc.id,
        url: `${requestUrl.protocol}//${requestUrl.hostname}`,
      };

      const r: { ok: boolean } = await (
        await fetch(
          apiUrl(ctx.env.BOT_TOKEN, "answerCallbackQuery", responseData),
        )
      ).json();
      return new Response(
        "ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2),
      );
    } else if ("data" in qbc) {
      if (qbc.data === "learn-more") {
        const responseData = {
          callback_query_id: qbc.id,
          text: `Sequence Tap Dance is a demo of a Telegram app that uses Sequence to authenticate users. The source code for the telegram bot and the webapp are available at https://github.com/0xsequence/telegram-kit-embedded-wallet-react-boilerplate`,
        };
        const msgUrl = apiUrl(ctx.env.BOT_TOKEN, "sendMessage", {
          chat_id: qbc.from.id,
          text: `Sequence Tap Dance is a demo of a Telegram app that uses Sequence to authenticate users. The source code for the telegram bot and the webapp are available at https://github.com/0xsequence/telegram-kit-embedded-wallet-react-boilerplate`,
        });
        await fetch(msgUrl);

        const r: { ok: boolean } = await (
          await fetch(
            apiUrl(ctx.env.BOT_TOKEN, "answerCallbackQuery", responseData),
          )
        ).json();
        return new Response(
          "ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2),
        );
      }
    }
  } else if ("message" in update) {
    let url = "";
    if (/\/game/.test(update.message.text)) {
      url = apiUrl(ctx.env.BOT_TOKEN, "sendGame", {
        chat_id: update.message.chat.id,
        game_short_name: "tap_dance",
      });
    } else {
      const requestUrl = new URL(ctx.request.url);
      url = apiUrl(ctx.env.BOT_TOKEN, "sendAnimation", {
        chat_id: update.message.chat.id,
        animation: `${requestUrl.protocol}//${requestUrl.hostname}/640.gif`,
        thumbnail: `${requestUrl.protocol}//${requestUrl.hostname}/happy.jpeg`,
        caption:
          "Play Sequence Tap Dance to see how Sequence integrates with Telegram Webapps",
        show_caption_above_media: "True",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              {
                text: "Play Now",
                web_app: {
                  url: `${requestUrl.protocol}//${requestUrl.hostname}`,
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
                text: "Learn More",
                callback_data: "learn-more",
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
