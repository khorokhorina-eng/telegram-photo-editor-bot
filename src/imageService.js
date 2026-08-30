export class ImageService {
  constructor({ apiKey, model }) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async editImage({
    imageBuffer,
    prompt,
    mimeType = "image/jpeg",
    filename = "source.jpg",
    size = "auto",
    maskBuffer = null,
    identityReferenceBuffer = null,
    identityReferenceMimeType = "image/jpeg"
  }) {
    const form = new FormData();
    form.append("model", this.model);
    form.append("prompt", prompt);
    // Preserve the source orientation for edits, except for social-profile avatars.
    form.append("size", size);
    // GPT Image 2 at medium is the production quality baseline. It supports
    // high-fidelity image input natively; the legacy input_fidelity parameter
    // is only sent to the older GPT Image 1 family below.
    form.append("quality", "medium");
    if (this.model.startsWith("gpt-image-1") && this.model !== "gpt-image-1-mini") {
      form.append("input_fidelity", "high");
    }
    form.append("image[]", new Blob([imageBuffer], { type: mimeType }), filename);
    // A second, close reference of the same source person gives the edit model a
    // dedicated identity anchor while the first image remains the full scene.
    // The Image API accepts multiple input images; their order matters when a
    // mask is used, so the editable source must remain first.
    if (identityReferenceBuffer) {
      form.append(
        "image[]",
        new Blob([identityReferenceBuffer], { type: identityReferenceMimeType }),
        "identity-face-reference.jpg"
      );
    }
    if (maskBuffer) {
      form.append("mask", new Blob([maskBuffer], { type: "image/png" }), "edit-mask.png");
    }

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`
      },
      body: form,
      // A network connection can otherwise remain open indefinitely. The worker
      // will return the consumed attempt and notify the user if this expires.
      signal: AbortSignal.timeout(120_000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI image edit failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const b64 = result?.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("OpenAI image edit returned no image data");
    }

    return {
      buffer: Buffer.from(b64, "base64"),
      filename: "edited.png",
      mimeType: "image/png"
    };
  }
}
