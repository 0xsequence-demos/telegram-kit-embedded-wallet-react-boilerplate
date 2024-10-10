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

  const debugUrl = apiUrl(ctx.env.BOT_TOKEN, "sendMessage", {
    chat_id: '@bunnybones1',
    text: 'test',
  });
  await (await fetch(debugUrl)).json();


  if ("inline_query" in update) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qbc = update.inline_query as any;
    if ("game_short_name" in qbc) {
    const requestUrl = new URL(ctx.request.url);
    const responseData = {
      callback_query_id: qbc.id,
      url: `${requestUrl.protocol}//${requestUrl.hostname}`,
    };
    console.log("respond with ", responseData);
    const r: { ok: boolean } = await (
      await fetch(
        apiUrl(ctx.env.BOT_TOKEN, "answerCallbackQuery", responseData),
      )
    ).json();
    return new Response(
      "ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2),
    );
  }
  } else if ("callback_query" in update) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const qbc = update.callback_query as any;
    if ("game_short_name" in qbc) {
      const requestUrl = new URL(ctx.request.url);
      const responseData = {
        callback_query_id: qbc.id,
        url: `${requestUrl.protocol}//${requestUrl.hostname}`,
      };
      console.log("respond with ", responseData);
      const r: { ok: boolean } = await (
        await fetch(
          apiUrl(ctx.env.BOT_TOKEN, "answerCallbackQuery", responseData),
        )
      ).json();
      return new Response(
        "ok" in r && r.ok ? "Ok" : JSON.stringify(r, null, 2),
      );
    }
  } else if ("message" in update) {
    let url = "";
    if (/\/start/.test(update.message.text)) {
      url = apiUrl(ctx.env.BOT_TOKEN, "sendGame", {
        chat_id: update.message.chat.id,
        game_short_name: "tap_dance",
      });
    } else {
      url = apiUrl(ctx.env.BOT_TOKEN, "sendMessage", {
        chat_id: update.message.chat.id,
        text: update.message.text,
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
