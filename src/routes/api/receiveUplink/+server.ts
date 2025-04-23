import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { pb } from "$lib/pocketbase";

// {
//   "data": {
//     "hour": 14,
//     "LDR1": 120,
//     "LDR2": 130,
//     "TEMP": -56,
//     "batt": 3000
//   }
// }

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { hydraId, hour, ldr1, ldr2, temp, batt } = body.data;

    const uplinkMessage = `Hydra ${hydraId} reported:
    Hour: ${hour}
    LDR1: ${ldr1}
    LDR2: ${ldr2}
    TEMP: ${temp}
    BATT: ${batt}`;
    
    console.log(uplinkMessage);
    const data = {
      "device": hydraId,
      "ldr1": ldr1,
      "ldr2": ldr2,
      "temp": temp,
      "batt": batt,
      "timestamp": `2025-04-23 ${hour}:00:00.123Z`
  };
  const record = await pb.collection('measurements').create(data);
  

    return json({ message: "Uplink received" }, { status: 200 });
  } catch (error) {
    console.error("Failed to handle uplink", error);
    return json({ error: "Failed to handle uplink" }, { status: 500 });
  }

  // try {
  //     const { chatId, message } = await request.json();

  //     if (!chatId || !message) {
  //         return json({ error: 'Missing required fields' }, { status: 400 });
  //     }

  //     const chat = bullshiftChats.get(chatId);
  //     if (!chat) {
  //         return json({ error: 'Chat session not found' }, { status: 404 });
  //     }

  //     // Send message and get response
  //     const result = await chat.sendMessage({message});
  //     const text = result.text;

  //     // Update chat history in database if needed
  //     await pb.collection('chats').update(chatId, { history: await chat.getHistory() });

  //     return json({
  //         response: text,
  //         timestamp: Date.now()
  //     });
  // } catch (error) {
  //     console.error('Error sending message:', error);
  //     return json({ error: 'Failed to send message' }, { status: 500 });
  // }
};
