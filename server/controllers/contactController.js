import { saveContactMessage } from "../services/contactService.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log("REQ BODY:", req.body);
    const saved = await saveContactMessage({ name, email, message });

    return res.status(201).json({
      success: true,
      message: "Message received!",
      data: saved,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong. Try again later.",
    });
  }
};
