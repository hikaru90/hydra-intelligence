import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { pb } from "$lib/pocketbase";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const decodedPayload = body.uplink_message.decoded_payload;
    const { ldr1, ldr2, temp, batt, uplinkMessage } = decodedPayload;

    const devEui = body.end_device_ids.dev_eui;
    const device = await pb.collection("orders").getFirstListItem(`devEui = "${devEui}"`);

    // Fallback values – you can replace with TTN metadata if needed
    const now = new Date();
    const hour = now.getHours();
    const timestamp = now.toISOString();

    console.log(uplinkMessage || `Hydra ${device.label} reported:\nHour: ${hour}\nLDR1: ${ldr1}\nLDR2: ${ldr2}\nTEMP: ${temp}\nBATT: ${batt}`);

    const data = {
      device: device.id,
      ldr1,
      ldr2,
      temp,
      batt,
      timestamp
    };

    try{
      const record = await pb.collection("measurements").create(data);
    }catch(error){
      console.warn("Failed to create measurement", error);
    }

    return json({ message: "Uplink received" }, { status: 200 });
  } catch (error) {
    console.error("Failed to handle uplink", error);
    return json({ error: "Failed to handle uplink" }, { status: 500 });
  }
};
