export const AVATAR_STYLES = {
  ai_glamour: {
    label: "AI-гламур",
    prompt:
      "Create a photorealistic, high-detail fashion campaign from the exact source person, inspired by luxury fashion-editorial photography with cinematic double exposure. Use a deliberately wider medium vertical portrait: the subject occupies no more than 70% of the canvas height, the top of all hair is at least 15% below the top image edge, and there is clear background around the entire head, neck, and upper torso. Never crop any hair, forehead, crown, or head. Style a deep scarlet or burnt-orange fluid dress, silk wrap, or tailored draped top with elegant movement. Keep hair down, loose, airy, and windswept, preserving real colour, hairline, and recognisable character. Use dramatic but flattering warm red/orange and deep teal lighting, a soft blurred duplicate silhouette or reflection behind the subject, and a few large out-of-focus golden bokeh circles in the foreground. Preserve the exact face and make it look gently fresher: brighten the eye area and soften tired shadows while retaining realistic skin texture, facial geometry, expression, teeth, and adult age. Do not add text, logos, watermarks, or posters. Avoid simplified rendering, cropped hair/head, generic glamour, heavy beauty filters, orange skin, or visual ageing."
  },
  art: {
    label: "Арт",
    prompt:
      "Transform the exact source person into a bright contemporary fashion illustration: expressive hand-painted gouache and coloured-pencil texture, soft powder-pink background, playful saturated accents in coral, yellow, green, and periwinkle blue, and clean graphic brushstrokes. Use a charming editorial portrait composition, artistic eyelashes and simplified painterly facial planes, and small contemporary floral or graphic earrings. Keep the person's true facial structure, eye colour, hair colour, hairstyle, expression, and apparent age clearly recognisable even in illustration form. The result should feel like an original premium magazine illustration — joyful, stylish, textured, and intentional — never a generic anime character, childish cartoon, photorealistic image, or a different person."
  },
  anime: {
    label: "Аниме",
    prompt:
      "Create a fully 2D illustrated contemporary anime avatar from the exact source person. Hard requirement: every visible pixel — face, neck, ears, hair, clothing, hands, foreground, and background — must be painted in the same opaque Japanese digital-illustration technique, with the same linework, cel-shading, brush texture, palette, and lighting. Do not retain, blend, or composite any photorealistic area of the source photo. The result must never look like a real face pasted onto a photograph or a drawn body; there must be no cutout edges, skin-texture mismatch, photographic fabric, realistic background, or difference in sharpness between the face and body. Preserve the person's distinctive face shape, brows, eye shape and colour, nose, mouth, hairstyle, hair colour, expression, apparent age, and clothing colours so they remain recognisable in illustration form. Use refined expressive eyes, delicate natural blush, detailed painted hair strands, a calm elegant setting, and warm illustrated light. Avoid exaggerated childish proportions, huge eyes, neon effects, fantasy costumes, plastic skin, or changing the person into someone else."
  },
  black_white: {
    label: "Чёрно-белый",
    prompt:
      "Create a photorealistic black-and-white fashion portrait closely inspired by an intimate studio photograph. For a single adult source, use a deliberately wide seated three-quarter vertical composition: leave at least 15% clear black background above all hair, show the complete head and hair with no crop, and include the body down through the knees. The person sits relaxed on a black fabric floor or low chair against a deep charcoal-black draped textile background, one knee bent and one elbow resting naturally near the temple. Dress them in a crisp oversized white button-down shirt with sleeves casually rolled and wide flowing black trousers. Create a subtly slimmer, elongated fashion-editorial silhouette through pose, garment drape, camera angle, and natural proportions — not through distortion. Keep hair loose, soft, and naturally tousled; preserve its real colour as tonal character, hairline, length, and recognisable shape. Use soft directional studio light that makes the face bright, young, and luminous against the darker background; maintain elegant black-and-white contrast but never deepen under-eye shadows, wrinkles, or any features that age the person. Preserve the exact face, apparent age, teeth, and identity. Never create an elderly, stern, heavily retouched, corporate, vintage, noir, or generic close-up portrait."
  },
  cinematic: {
    label: "Кинематографичный",
    prompt:
      "Create a photorealistic cinematic fashion photograph closely matching a sunlit vintage-American-roadside convertible editorial. The source face is the non-negotiable highest-priority reference: reproduce the exact same immediately recognisable person, preserving facial geometry, cheek fullness, eye size and spacing, brows, nose, lips, teeth, jawline, chin, skin tone, apparent age, expression, hairline and natural asymmetries. Do not symmetry-correct, beautify, slim, lengthen, smooth, de-age, age, change ethnicity, replace the person with a generic fashion model, or let wardrobe and lighting override facial identity. Do not retouch the face at all: retain the original real skin texture, under-eye area, freckles or other natural details visible in the source. For a single adult source, place this exact recognisable person sitting casually and relaxed in the driver's seat behind the steering wheel of a cream-coloured vintage convertible with the roof fully down; use a natural three-quarter angle, relaxed shoulders, one arm loosely resting on the door or wheel, and no stiff frontal selfie pose. Frame them from outside the driver's side so the cream leather interior, steering wheel, windscreen frame, and open cabin are all clearly visible. Use a sunny retro boulevard with palm trees, a pastel teal-and-coral diner/motel-style sign and low buildings softly blurred in the background — no sea cliff and no handbag. Dress them exactly in a light pistachio-green tailored blazer and matching trousers over a cream ribbed knit top. Add large opaque pale-green cat-eye sunglasses with thick frames and a lavender/pale-lilac patterned silk headscarf tied under the chin, with a few natural loose strands of hair. Use bright direct California-style sun, crisp high-detail colour, subtle film grain, and a playful polished editorial mood. The image must feel like a premium editorial fashion still, not a costume, generic travel photo, dark thriller, or corporate portrait."
  },
  business: {
    label: "Деловой",
    prompt:
      "Create a fresh modern business portrait from the exact source person, with the feeling of a refined creative-professional profile photo rather than a formal corporate headshot. Use a clean vertical waist-up portrait with the complete head, crown, hair and natural neck fully visible, plus generous airy background above the hair. Preserve exact face, facial contour, cheeks, jaw, chin, eyes, teeth, apparent adult age, skin texture and body proportions. Do not age the person, add wrinkles, thicken the neck, broaden shoulders, make the torso heavier, alter weight, or create a generic executive face. Keep the original hairstyle exactly recognisable: same length, hairline, parting, texture and loose shape. Only tame a few flyaways and add subtle healthy shine and soft movement; never make a helmet-like blowout, bob, bun, severe sleek style, or a new haircut. Dress a feminine presentation in a lightweight unpadded soft-grey, taupe or warm-brown relaxed blazer with natural shoulders and a modern straight silhouette, open over a simple ivory silk top or fine white T-shirt; use a small understated gold earring if suitable. The jacket must look light and naturally fitted, never oversized, bulky, padded or boxy. Use bright soft daylight and a pale modern off-white or warm-grey interior, with clean realistic colour. Apply only a subtle fresh makeup/grooming finish: gently even skin, natural brow and lash definition, soft healthy lips. The person must look like the exact same, contemporary, well-rested and approachable person — not older, heavier, severe, overly corporate or overly retouched."
  },
  male_classic: {
    label: "Классический",
    prompt:
      "Create a photorealistic premium modern menswear portrait from the exact adult source person. Use a vertical waist-up composition in a softly lit warm-grey studio with the full head and hair visible and generous space above. Preserve the exact face, facial contour, cheeks, jaw, chin, eye shape and spacing, nose, mouth, teeth, skin texture, apparent age, hairline, beard or stubble and natural asymmetry. Dress a masculine presentation in a refined charcoal or deep-navy unstructured blazer over a clean white T-shirt or fine knit; no tie, no stiff corporate pose. Keep their real hairstyle recognisable, only neatly groomed. Use subtle natural grooming and clean editorial daylight. Never age, slim, widen, reshape, beautify, replace the face or turn the person into a generic male model."
  },
  male_street: {
    label: "Городской стиль",
    prompt:
      "Create a photorealistic contemporary menswear editorial from the exact adult source person. Use a vertical three-quarter composition on a refined modern city street in soft overcast daylight, with architecture gently blurred. Dress a masculine presentation in a relaxed dark overshirt or bomber jacket, fitted neutral T-shirt, straight dark trousers and clean understated trainers. The pose is casual and natural, not a fashion-model caricature. Preserve the exact source face, facial contour, cheek fullness, jaw, chin, eye shape, nose, mouth, beard/stubble, skin texture, hairline, apparent age and body proportions. Keep the real hairstyle recognisable with only light grooming. Do not add bulk, change weight, slim, reshape, beautify, de-age, age or replace the person."
  },
  male_cinematic: {
    label: "Кино-портрет",
    prompt:
      "Create a photorealistic cinematic menswear portrait from the exact adult source person. Use a wider vertical three-quarter portrait in a warmly lit book-lined lounge or creative studio at blue hour, with subtle practical lights in soft bokeh and rich but natural colour. Dress a masculine presentation in a textured dark knit or relaxed brown jacket. Keep the mood thoughtful, confident and natural; no thriller, gangster, luxury-car cliché or harsh shadows that age the face. Preserve exactly the source face, facial contour, cheek fullness, jaw, chin, eye shape, nose, mouth, teeth, beard/stubble, skin texture, hairline, apparent age and natural asymmetry. Do not reshape, slim, widen, smooth, beautify or replace the person."
  },
  male_black_white_studio: {
    label: "Студийный ч/б",
    prompt:
      "Create a photorealistic black-and-white modern menswear studio portrait from the exact adult source person. Use a relaxed vertical waist-up composition with full head, hair and shoulders visible against a softly textured mid-grey backdrop. Dress a masculine presentation in a simple black crew-neck top or open dark shirt. Use clean directional studio light with a luminous face and genuine texture, never heavy noir shadows or ageing contrast. Preserve exact facial contour, cheek fullness, jaw, chin, eye shape, nose, mouth, teeth, beard/stubble, hairline, skin texture, apparent age and identity. Do not create a generic model, alter weight, slim or reshape the face, add wrinkles or overly retouch skin."
  },
  editorial: {
    label: "Редакционный",
    prompt:
      "Create a photorealistic high-fashion beauty editorial portrait with an airy couture feeling, soft intimate window light, and a pale cream or light warm-grey studio interior. For a single adult source, use a close three-quarter portrait with one shoulder gently bare or only lightly covered. Add a single large piece of white translucent chiffon or organza that moves naturally in a light wind: it wraps loosely around and partly covers the bare shoulder, neckline, and upper torso, while its long edges lift and float behind and in front of the person. The fabric must be sheer, fluid, and windblown, with visible soft folds and areas of transparency; it should partly obscure what the person is wearing, but never form ruffles, a bow, sleeves, a dress, a blouse, or any defined garment. Preserve the exact hair colour, hairline, length, and recognisable hairstyle, but transform it into a stylish modern editorial updo or loose textured arrangement with windswept volume and a few soft strands around the face. Add only small contemporary sculptural metallic earrings in silver or gold, if appropriate — never pearls, pearl jewellery, crystal drop earrings, vintage jewellery, or anything that reads dated. For an adult who wears makeup, add only a subtle fresh editorial grooming finish: naturally even skin, delicate definition of lashes and brows, and a muted lip tone, with no beauty-filter effect. The result should be luminous, fashion-forward, romantic, and editorial. Do not create a corporate portrait, a beauty-filter selfie, a dark fashion shoot, or a casual lifestyle scene. No plastic skin, heavy makeup, orange/brown grading, harsh contrast, or visual ageing."
  },
  y2k: {
    label: "Y2K-стиль",
    prompt:
      "Create a photorealistic Y2K fashion editorial using this exact person. For a single adult source photo, use a playful overhead or high-angle three-quarter vertical composition in a candy-pink 2000s-inspired room: a fluffy blush-pink rug or bedspread, scattered vinyl records, retro fashion magazines with no readable logos or text, and glossy direct-camera flash. Style the person in a chic pink fitted T-shirt, cropped jacket, or sporty top with a ruffled satin skirt or layered Y2K accessories; add pink heart-shaped sunglasses, a bubble-gum bubble if it fits naturally, and playful silver jewellery. Adapt the clothing naturally to the person's presentation while retaining the same campy pink Y2K mood; do not force feminine clothing or makeup on a masculine person. Do not stylize, redraw, or alter the face in any way; the face must remain a faithful photographic match to the input. Keep skin tone neutral and realistic, not overly orange or airbrushed."
  }
};

export const PHOTOSHOOT_TEMPLATES = {
  art_portrait: {
    label: "🎨 Арт-портрет",
    prompt: "Recreate the exact dramatic reference as a premium Vogue-like desert fashion editorial, not a casual portrait: use a vertical 2:3 full-length composition with the person centred under one enormous ancient rough dark-stone arch. The arch must dominate the upper half of the frame and curve widely above the subject; behind it are hazy distant mountains, a pale beige sky and dense wind-blown sand/dust drifting across the lower scene. The person stands poised and nearly frontal with their natural source expression; do not invent a new expression. Dress a feminine presentation in a couture off-the-shoulder black gown with sculptural folded sleeves, a clean fitted bodice, huge full skirt and an exceptionally long dramatic black train that spreads across most of the foreground and streams far to the left through the sand haze. Style hair as abundant long, glossy, voluminous loose windblown waves in the source hair colour, with soft movement around the shoulders; add contemporary gold statement earrings. FACE PRESERVATION OVERRIDES THE FASHION REFERENCE: reproduce the uploaded face faithfully and essentially unchanged, as if the exact original face were photographed in this new location. Do not create a fashion-model version of it. Preserve exactly the original face oval and facial width, cheek fullness, temples, jaw width and corners, chin width and length, eye size and spacing, eyelids, nose bridge and tip, lips, teeth, skin texture, apparent age, expression and asymmetry. No face reshaping, slimming, lengthening, lifting, eye/lip enlargement, contouring, skin replacement, de-aging or beautification. Facial editing is limited to a very subtle natural retouch of temporary blemishes and a light editorial makeup layer only: softly defined eyes, neutral fresh complexion and natural lips, while retaining all original face geometry and real skin. The editorial finish must come from clothing, fabric, hair, camera distance, lighting and scene — never facial reconstruction or body reshaping. Do not make a simplified desert backdrop, small arch, flat dress, everyday pose, illustration, text, logo, watermark, plastic skin or casual snapshot."
  },
  peonies_mountains: {
    label: "🌸 Пионы в горах",
    prompt: "Create a premium mountain fashion editorial, not a bridal, graduation or prom portrait. Use a vertical 2:3 composition with generous blue mountains, valleys, clouds and pale dawn sky visible around the subject. Use a chic over-the-shoulder pose: the body is turned mostly away from the camera, one bare shoulder and upper back are visible, while the head turns naturally back toward the lens with a poised, confident gaze. The source face is the highest priority: reproduce the exact same recognisable person, not a beautified lookalike. Keep the original face shape, cheek fullness, jaw, chin, eye size and spacing, nose, lips, teeth, expression, skin texture, apparent age, ethnicity, hairline and all natural asymmetries. Do not slim, lengthen, reshape, smooth, idealise or replace the face. Dress a feminine presentation in a modern pale blush silk fashion dress with a clean low back, delicate straps and fluid editorial drape — chic and contemporary, never a wedding dress, ball gown, bridesmaid dress or graduation look. Let a bouquet of lush pale-pink peonies sit naturally at the lower side of the body, partly in the foreground but never held formally in front like a bridal bouquet and never covering the face. Give them an intentionally undone, high-volume textured updo in the source hair colour: a soft lifted crown and bun, with many fine airy strands and delicate curls visibly escaping around the temples, ears, nape, crown and back of the head. The hairstyle must feel romantic, wind-touched and editorial — not a sleek tight bun, flat hair, or a casual everyday hairstyle. Use only minimal fresh makeup: softly defined eyes and natural lips, with real skin retained; do not change facial structure. The image must look like a glossy modern fashion campaign: elegant, spacious, cinematic and high detail, with believable hands, fabric, anatomy and natural scale."
  },
  golden_autumn: {
    label: "🍂 Золотая осень",
    prompt: "Create this exact photorealistic golden-autumn fashion image, changing only the face and hair colour to match the exact source person: a tall elegant full-length person standing in a sunlit field of dry autumn grass at golden hour. Use low warm backlight, glowing sun flare behind the shoulder, softly blurred dark trees, and long natural grass in the foreground. For a feminine presentation, dress them in a long textured camel teddy/shearling coat over a cream floral bohemian maxi dress and a wide-brimmed rich chocolate-brown felt hat; no scarf, neck wrap, shawl, turtleneck or fabric around the neck. Style loose windswept hair and subtle fresh editorial makeup that gives a rested, youthful-but-real appearance — never mature, aged, heavily retouched, wrinkled or orange-toned skin. Their hands hold the open coat naturally and their gaze is turned slightly to the side. Do not add a wedding ring, engagement ring, any rings, jewellery, watch, or accessories that are not visibly present in the source image. Keep the tall fashion silhouette from the pose, camera, coat, and styling only — no warped anatomy. Preserve exact face, age, skin tone, and identity. No text, logo, watermark, orange skin, or artificial-looking light."
  },
  flash_party: {
    label: "📸 Flash-вечеринка",
    prompt: "Recreate a high-end 1990s-style nightclub fashion photograph while preserving the source person's face as an immutable identity reference — do not substitute it with a generic glamorous model. The output must show the same immediately recognisable person: retain the exact face shape, cheek fullness, jaw, chin, eye size and spacing, eyebrows, nose, mouth, teeth, skin tone, hairline, natural asymmetries and apparent age from the source. Do not slim, lengthen, beautify, smooth, reshape, age, de-age, enlarge lips or alter any facial feature. Use a vertical nearly full-length editorial composition from the complete head to below the knees: the person is standing and dancing naturally in front of a deep red velvet booth, with a large mirrored disco ball at the upper left, softly blurred stylish adult guests behind them, and rich dark red club ambience. Dress a feminine presentation in a fitted deep olive-green metallic long-sleeve wrap dress exactly like a sleek evening dress: a clean V neckline, softly draped waist tie, defined natural waist, elegant thigh slit and a fluid slim silhouette — never a loose robe, bulky fabric, protruding stomach, widened hips or a heavier body. Give them long, glossy, voluminous loose waves in the source hair colour and only restrained evening makeup: a very light eye definition, natural blush and natural lip colour; real skin must remain visible. Capture an effortless joyful dance pose: one arm is lifted high with a relaxed wrist and graceful open hand, the other arm hangs naturally; the shoulders, neck and hands look relaxed and anatomically correct. In the lower-left foreground, show only a masculine hand holding a tall narrow champagne flute filled with pale-gold sparkling wine and visible tiny bubbles; never use beer, foam, a beer glass or a goblet. Use strong direct-camera flash, candid fashion-party grain, bright flash highlights on the dress and disco ball, deep warm shadows, and several authentic lens flare blooms at the frame edges. No text, logo, watermark, UI, distorted hands or plastic skin."
  },
  italian_summer: {
    label: "🌊 Итальянское лето",
    prompt: "Use the provided Italian-summer reference only for the exact background, wardrobe, pose, hairstyle and composition — never use, blend in, or imitate the reference model's face or body. Replace the reference person entirely with the exact recognisable source person. Recreate the full vertical fashion composition: the person sits elegantly one step higher on the wide weathered pale-stone staircase in a sunlit southern Italian alley, with the stair tread visible directly beneath them, one knee bent, legs relaxed and bare feet visible naturally on the lower step. Make the bare feet elegant, naturally slender and anatomically correct, proportionate to the source person's real feet; never enlarge, widen, thicken or distort them. They wear the same luminous buttery-yellow satin midi slip dress with thin straps and a gently draped skirt. Place a large rustic woven basket overflowing with fresh bright lemons on the lower left beside them, with several loose lemons scattered naturally across the steps. Add the same slim blue-and-white patterned headscarf tied at the top, with the hairstyle underneath as softly voluminous loose waves in the source person's exact hair colour; preserve the source hairline. Include delicate small gold earrings and only a very subtle fresh warm makeup: a soft natural peach-pink blush on the cheeks, light eye definition and natural lips, retaining real skin and never changing facial structure. Use strong golden Mediterranean sunlight, deep crisp shadows and warm textured old-stone walls and stairs. Preserve the source person's own body exactly — their real torso, waist, abdomen, bust, shoulders, arms, hips and leg proportions. Do not make the body thicker, wider, heavier, bulkier or more muscular than the source, and do not use the reference model's body. Preserve the source person's exact face as an immutable identity: face shape, cheek fullness, jaw, chin, eye size and spacing, eyebrows, nose, mouth, teeth, skin tone, apparent age, hairline and natural asymmetry. The face must clearly be the source person, not a generic beauty or the reference model. Keep the natural expression from the source photo exactly: if the source person is neutral or unsmiling, keep a neutral unsmiling expression; never force a broad smile, different teeth or a different expression. Use realistic glossy magazine-fashion detail. No blue door, roses, text, logos, watermark, UI or extra people."
  },
  city_motion: {
    label: "🏙️ Городской кадр",
    prompt: "Create this exact photorealistic contemporary city-fashion image, changing only the face and hair colour to match the exact recognisable source person. The source face is immutable and must be sharply recognisable: preserve exact facial geometry, cheek fullness, jaw, chin, eye shape and spacing, eyebrows, nose, mouth, teeth, skin tone, apparent age, hairline and natural asymmetries; never create a generic model, smooth, beautify or reshape the face. Give a very subtle fresh, rested appearance only: brighten tired shadows minimally and keep natural real skin, without changing age, facial structure, neck shape or length. The neck must look natural, smooth and consistent with the source person's age, not aged, thickened, lengthened or artificially retouched. Use the cinematic candid composition of the reference: a vertical waist-up to three-quarter portrait on a sunlit modern city street, captured as the person turns back over one shoulder while walking. Keep the face in crisp focus but use strong natural shallow depth of field and motion blur around the outer edges of the image: blurred foreground architecture, softly smeared street highlights, distant passers-by and background buildings, never blur the person's facial features. Dress a feminine presentation in a modern rich camel-brown oversized tailored coat with a clean relaxed silhouette; show a glimpse of a refined neutral top beneath. Style the real hair as long, loose, voluminous windswept waves in the original colour, dramatically moving backward in the breeze; preserve actual hairline and recognisable character. Add only subtle fresh makeup with natural skin. Keep the pose confident, spontaneous and editorial — not stiff or like a posed studio portrait. Preserve the source body's exact natural build; do not make them heavier, wider, thicker or bulkier. No text, logos, watermark, excessive blur over the face, distorted hands or plastic skin."
  },
  magazine_cover: {
    label: "🕯️ Обложка журнала",
    prompt: "Create a photorealistic luxury travel-fashion editorial in the exact composition of a poised person seated in a weathered turquoise wooden boat. Use a high three-quarter camera angle: the person reclines elegantly inside the chipped blue-green boat, one arm resting naturally on its edge, amid dense dark emerald tropical jungle foliage. Dress them in a structured all-white outfit: a white blouse with pronounced puff sleeves and V neckline plus flowing wide-leg white trousers; add small sculptural gold earrings and a small structured ivory handbag with subtle gold hardware beside them. FACE PRESERVATION OVERRIDES THE MAGAZINE STYLE: use the uploaded face faithfully and essentially unchanged, rather than creating an idealised magazine model. Preserve the exact source oval, face width, cheek fullness, jaw, chin, eye size and spacing, eyebrows, nose, lips, teeth, skin tone, hairline, apparent age, expression and natural asymmetry. Facial edits are limited to restrained temporary-blemish retouch and a light makeup layer only: softly defined lashes, subtle liner and gently brightened eye area. Do not slim, lengthen, smooth, beautify, de-age, age, contour, reshape or replace any facial feature. Use soft diffused daylight through leaves, detailed fabric texture, the source person's natural composed expression, and rich green-and-turquoise contrast. Do not add any magazine text, logo, watermark, border, or artificial plastic skin."
  },
  heart_hair: {
    label: "🌅 Закат",
    prompt: "Create a photorealistic cozy golden-hour lifestyle editorial using the exact recognisable source person. The source face is the non-negotiable primary reference: reproduce the exact same person rather than a pretty lookalike, retaining exact face shape, cheeks, jaw, chin, eye size and spacing, eyebrows, nose, mouth, teeth, skin tone, apparent age, hairline, expression and natural asymmetry. Do not beautify, slim, lengthen, smooth, reshape, age or replace the face. Use a vertical near-full-length composition: the person sits casually sideways on a dark green wooden park bench at sunset, one leg folded comfortably on the bench and the other foot on the ground. They hold a clear takeaway cup with an iced drink and a paper straw in both hands. Dress them in a modern soft oatmeal oversized knit sweater, relaxed neutral cargo trousers, white mid-calf ribbed sports socks pulled clearly above the ankles, and clean white low-top retro trainers with a simple sole — not heels, boots, short ankle socks or fashion shoes. Style the source hair in a natural loose, softly messy updo with fine wind-blown face-framing strands; use minimal fresh makeup and preserve the source expression without forcing a smile. Behind them, show an open green park, softly blurred people in the distance, dark trees and a vivid dramatic sunset sky: saturated coral, apricot and orange-pink clouds with golden glow and bokeh, clearly brighter and more colourful than an overcast evening. Preserve the source body exactly: the same torso width, waist, abdomen, shoulders, hips, arms, thighs and legs. Do not add volume, widen the body, thicken the torso, enlarge the abdomen or change weight; use clothing drape and pose only. No text, logos, watermark, UI or distorted hands."
  },
  birthday: {
    label: "🎂 День рождения",
    prompt: "Recreate this exact photorealistic high-fashion birthday editorial using the exact recognisable source person. The mood is glossy luxury magazine, like a polished fashion campaign: rich controlled studio lighting, cinematic warm contrast, expensive fabric texture, crisp subject detail, refined composition and subtle premium editorial film grain — never a casual home snapshot. Use a vertical waist-up to three-quarter composition at a dark polished tabletop in front of a seamless warm taupe studio wall. The table is art-directed with irregular tall stacks of oversized chocolate-chip cookies, each stack decorated with a few thin pastel birthday candles glowing with real flames; a few extra cookies form an intentional foreground composition. The person holds one tall cookie stack in a hand and wears a large ornate antique-gold crown with believable metal detail, touching it naturally with the other hand. Dress a feminine presentation in a sophisticated sculptural warm bronze-gold evening dress or top with an elegant neckline and a luxury styling silhouette. Preserve the reference hairstyle exactly: long, glamorous, loose, high-volume glossy waves cascading over both shoulders. Change only the hair colour to the source person's actual hair colour; do not use rollers, a bun, short hair or a different hairstyle. Add restrained elevated evening makeup — clean defined eyes, luminous real skin and a refined lip — without altering facial structure. The source face is the non-negotiable primary reference: reproduce the exact same face, not the face from the reference or a generic glamorous model. Preserve exact face shape, cheek fullness, jaw, chin, eye size and spacing, eyebrows, nose, mouth, teeth, skin tone, apparent age, expression and natural asymmetry. Do not beautify, slim, lengthen, smooth, age, de-age or alter any facial feature. No text, numbers, logo, watermark, UI, distorted hands or altered body proportions."
  },
  polaroid: {
    label: "📷 Polaroid",
    prompt: "Create a photorealistic analogue Polaroid-inspired fashion portrait of the exact source person. The finished image MUST be presented inside a physical white instant-film Polaroid border on all four sides: a slim white border at the top and sides, and a clearly much thicker blank white border at the bottom, approximately 20% of the total image height. This frame is mandatory and must never be omitted, cropped away, replaced by a digital overlay, or contain captions, handwriting, logos or text. Inside the Polaroid frame, use a vertical casual-yet-editorial composition with soft direct flash, gentle film grain, slightly muted colours and a clean cosy interior. Keep the real face, facial shape, age, hair character and body proportions immediately recognisable; add only a light polished makeup and hair finish where appropriate."
  },
  sweater: {
    label: "🧶 В свитере",
    prompt: "Create a photorealistic cosy autumn fashion editorial with the exact source person. Use a vertical three-quarter portrait by a softly lit window or in a warm minimal room; dress them in an elegant oversized textured knit sweater in cream, soft grey or warm oatmeal, with natural loose styled hair and understated fresh makeup. Use gentle daylight, tactile knit texture and a calm expensive magazine mood. Preserve exact face, face shape, age, identity and natural body proportions. No text, logo or watermark."
  },
  sea_escape: {
    label: "🌊 На море",
    prompt: "Create a photorealistic luxury seaside fashion editorial using the exact recognisable source person. Use a vertical full or near-full-length composition on a sunlit Mediterranean shore or elegant coastal terrace, with blue sea, pale stone, soft wind and warm late-afternoon light. Style a flowing linen or silk resort look, naturally windswept hair and refined fresh makeup. Keep the exact source face, facial shape, age, identity and realistic body proportions; create a long elegant silhouette only through pose, clothing and camera distance. No text, logo, watermark or artificial skin."
  },
  modest_sage_studio: {
    label: "🌿 Шалфейный свет",
    prompt: "Create a glossy modest-fashion studio editorial from the exact source person. Use a vertical 2:3 seated three-quarter composition beside a charcoal and pale-concrete wall with one sculptural shaft of daylight. Frame from clear space above the fully covered head down to the hips or below the bust — never a face-only or shoulder-only crop. Dress the person in a soft sage-green opaque hijab, flowing layered sage blouse and pale ivory pleated skirt. The look is refined, calm and contemporary, with delicate metallic earrings and fresh restrained makeup. The hijab must fit as a closed, fully covering headscarf: completely conceal all hair, hairline, bangs, temples and nape under opaque fabric; no visible strands anywhere. Preserve the exact facial geometry, face oval, cheeks, jaw, chin, eyes, nose, lips, age, expression and natural skin texture. Do not replace the person, slim or reshape the face/body, age them, or add text, logos or watermark."
  },
  modest_car_style: {
    label: "🚘 За стеклом",
    prompt: "Create a high-end modest-fashion automotive editorial from the exact source person. Closely follow this composition: a vertical 2:3 medium portrait viewed through the open rear side window of a premium dark car. Keep clear space above the fully covered head and show the person from head through the lower bust or waist, including the tailored jacket and relaxed seated posture; never crop at the shoulders or make a face-only close-up. The curved window frame fills the top and lower foreground, while soft beige leather upholstery and a large pale headrest sit behind the person. Dress them in a clean tailored black suit and matte-black opaque hijab, with large sculptural gold statement earrings and polished but natural brighter evening makeup: defined eyes, fresh luminous skin and a refined lip. Each earring must be physically attached through the visible earlobe and emerge naturally from beside the ear; never pin, clip, glue or hang jewellery from the hijab fabric. Do not add sunglasses or other face-covering accessories. Keep the person seated naturally and relaxed, with realistic hands and body proportions. The hijab is a closed, securely fitted headscarf that completely conceals all hair, hairline, bangs, temples and nape under opaque fabric: no visible hair strands anywhere. No car logo, text, watermark or UI."
  },
  modest_heritage_light: {
    label: "✨ Свет узоров",
    prompt: "Create a photorealistic luxury modest-fashion portrait from the exact source person in an old-world architectural interior. Use a vertical 2:3 medium portrait beside an ornate carved wooden screen, with clear space above the fully covered head and the figure visible through the lower bust or waist, never a shoulder-only close-up. Use patterned warm sunlight falling across an ivory silk hijab and a deep olive abaya. Add contemporary gold statement earrings and light polished makeup while keeping realistic skin texture. Each earring must be worn through the visible earlobe, emerging naturally at the ear edge; it must never be attached to, pinned onto or float over the hijab fabric. The person's true face must remain unchanged and recognisable: retain exact face oval, cheeks, jaw, chin, eye shape, nose, lips, age and expression. The head covering must be a closed, opaque, securely fitted hijab that fully conceals the scalp, hairline, bangs, temples and nape. If the source has visible hair, replace every bit of it with matching hijab fabric; a finished image with even one visible hair strand, bang, hairline or loose hair is invalid. No beauty-filter face replacement, no ageing, no text, logo, watermark or distorted anatomy."
  },
  modest_pearl_satin: {
    label: "🤍 Жемчужный атлас",
    prompt: "Create a contemporary pearl-and-satin modest-fashion editorial from the exact source person. Use a vertical 2:3 graceful side-profile or three-quarter pose in warm diagonal window light against a pale taupe wall. Frame from clear space above the fully covered head through the lower bust or waist, so the blouse and necklace are visible; never create a face-only or shoulder-only crop. Dress the person in a luminous cream satin hijab and matching draped long-sleeve blouse, with small elegant pearl stud earrings placed naturally at the visible earlobe edge and a short pearl necklace. Do not use dangling pearl earrings; jewellery must never be pinned, clipped, glued or floating on top of hijab fabric. Keep the photograph sophisticated and modern, never bridal or dated. Preserve the exact person and unaltered facial geometry: face oval, cheeks, jaw, chin, eyes, nose, lips, age, expression and skin tone. The cream satin hijab must be closed, opaque and securely fitted, completely concealing the scalp, hairline, bangs, temples and nape; no hair or loose strands may be visible anywhere. Do not reshape, age, de-age, replace the face/body, or add text, logos or watermarks."
  },
  modest_white_architecture: {
    label: "🏛️ Белая архитектура",
    prompt: "Create a high-gloss luxury fashion-magazine editorial from the exact source person, with polished Vogue-style lighting, refined tonal grading, dimensional couture fabric and crisp premium photographic detail. Closely recreate this precise scene: a tall vertical 2:3 full-length composition from a slightly greater camera distance, with the full legs and feet clearly visible, generous bright pale-blue sky with soft white clouds in the upper third, and monumental smooth white futuristic architecture with enormous circular and rounded arched openings behind. The person walks naturally toward the camera in a luminous ivory opaque hijab and an elegant streamlined ivory satin abaya/gown; keep fabric graceful and flowing but avoid excessive bulk, oversized sleeves or a balloon-like silhouette. Use a naturally slender, long editorial silhouette through a lean straight clothing cut, defined waist, graceful posture and camera distance; never widen, thicken or add volume to the source body. Keep the outfit elegant, modern and fully modest, with minimal gold bracelets and a subtle freshening makeup: softly defined eyes, even luminous skin and natural lips. Preserve the source person's exact face oval and width, cheeks, jaw, chin, eyes, nose, lips, apparent age and natural asymmetry; only lightly soften existing deep lines or harsh shadows, never alter facial contours or replace the face. The head covering is a closed, securely fitted opaque hijab that completely conceals all hair, hairline, bangs, temples and nape: no visible hair strands anywhere. Preserve natural proportions and believable hands. No text, logo, watermark or UI."
  },
  modest_lake_escape: {
    label: "🛥️ На озере",
    prompt: "Create a high-gloss luxury fashion-magazine lake editorial from the exact source person, with premium editorial light, rich dimensional colour grading and realistic couture fabric detail. Use a vertical 2:3 wide full-body composition from a noticeably greater camera distance: show most of the classic varnished-wood speedboat deck, the full seated pose and expansive deep-blue mountain lake with distant Italian hillside villages at golden hour. The person sits gracefully on the deck, one hand naturally resting on it. Dress them in a pale blush or ivory opaque hijab, a fully modest high-neck flowing cream blouse and a long champagne satin skirt. Construct the hijab as a closed, securely wrapped opaque head covering that stays fixed over the scalp and hairline, then wraps around the neck like a soft scarf. The flowing fabric must be only one separate long tail that begins at the neck/shoulder wrap (below the jaw), passes behind the shoulder and streams in the wind from there; it must never originate from the back of the head, crown or nape. Do not expose hair, hairline, bangs, temples or nape. There must be no neckline, decolletage or exposed chest. Use sophisticated light freshening makeup with softly defined eyes, even luminous skin and natural lips. Preserve the source person's exact identity and facial contours: face oval and width, cheek fullness, jaw, chin, eyes, nose, lips, apparent age and natural asymmetry; lightly soften only existing deep lines/harsh shadows and never reshape, narrow, lengthen or replace the face. Preserve natural body proportions. No text, logo, watermark or UI."
  }
};

export const BACKGROUND_OPTIONS = {
  remove_only: {
    label: "Удалить фон",
    prompt:
      "Cut out the main subject cleanly, remove the background, and keep the result suitable for a transparent-background export."
  },
  white: {
    label: "Белый фон",
    prompt:
      "Replace the background with a clean plain white studio background while keeping the subject realistic and well separated."
  },
  studio: {
    label: "Студия",
    prompt:
      "Replace the background with a clean premium studio setup with soft professional lighting."
  },
  office: {
    label: "Офис",
    prompt:
      "Replace the background with a modern clean office interior suitable for a professional profile."
  },
  sea: {
    label: "Море",
    prompt:
      "Replace the background with a beautiful sea view that looks natural and well matched to the subject."
  },
  mountains: {
    label: "Горы",
    prompt:
      "Replace the background with scenic mountains, realistic depth, and natural outdoor lighting."
  },
  sunset: {
    label: "Закат",
    prompt:
      "Replace the background with a warm sunset scene that looks visually rich and natural around the subject."
  },
  city: {
    label: "Город",
    prompt:
      "Replace the background with a modern city backdrop that looks polished and natural for the subject."
  }
};

const FACE_LOCK_RULES = `
NON-NEGOTIABLE IDENTITY PRESERVATION: the output must depict the exact same,
immediately recognizable person from the input photo, never a lookalike. Make a
conservative edit of the existing photo rather than a new interpretation. Preserve the
original facial geometry, eyes, eyebrows, nose, mouth, smile, teeth, jawline,
proportions, apparent age, ethnicity, hairstyle, and expression. The nose is an
identity feature: preserve its exact bridge, width, length, tip, nostrils and profile;
never make it smaller, narrower, straighter, shorter, lifted, refined or otherwise
reshape it. Keep the rendering natural and flattering: do not make wrinkles, skin
texture, under-eye shadows, or other minor imperfections more prominent. Any retouching
must be subtle and retain realistic skin texture.`.replace(/\s+/g, " ").trim();

const FACIAL_CONTOUR_LOCK_RULES = `
FACIAL-SHAPE LOCK: unless the user explicitly requests a change to the face shape,
preserve the source person's exact facial outline and proportions. In particular, do
not narrow or slim a naturally round, oval, square, or wide face; do not reduce cheek
width or cheek fullness; do not create a V-shaped jaw; do not lengthen, sharpen, point,
or narrow the chin; do not contour the face into a different shape. Face shape is an
identity feature, not a flaw to beautify. Makeup, lighting, hairstyle, and a new scene
must not visually reshape the face. A person who knows the source must recognise the
same cheeks, jawline, and chin at first glance.`.replace(/\s+/g, " ").trim();

const FRESH_NATURAL_FACE_RULES = `
NATURAL FRESHNESS RULE: preserve the person's real adult age and exact facial shape,
but make the face only subtly fresher and more rested through realistic professional
retouch. Do not automatically make a person older or younger. The source face must
retain its firm natural oval, cheek support and original jawline: never invent or
emphasise jowls, sagging cheeks/jawline, loose skin, heavy under-eye bags, deepened
nasolabial folds, wrinkles, tired shadows or a drooping facial contour that are absent
from the source photo. Gently soften only existing harsh under-eye shadows and deep
expression lines, retain natural pores and texture, and use only light fresh flattering
makeup or grooming. Do not slim, lift, stretch, lengthen, smooth into a new face, or
replace the face; freshness must look like the same person after good sleep, never a
different or artificially de-aged model.`.replace(/\s+/g, " ").trim();

const FINAL_SOURCE_FACE_MATCH_RULES = `
FINAL SOURCE-FACE MATCH — this has higher priority than the template, styling, makeup,
camera angle and fashion finish. Render the exact person in the uploaded photograph,
not an attractive approximation. Before delivering, match the source face feature by
feature: exact face oval and width, forehead, temple width, cheek volume, jaw and chin,
eye size and spacing, brow shape, nose bridge/width/length/tip/nostrils, lips, teeth,
skin tone and natural asymmetry. Do not borrow or average any feature from a template
model. Never slim, shorten or refine the nose; never narrow or lengthen the face. The
only permitted face edit is light restorative retouch: soften existing tired shadows or
deep lines without erasing texture or changing apparent age. If faithful identity
conflicts with a fashionable pose, light, makeup or composition, preserve the source
identity and weaken the styling detail. A friend of the person must recognise them
immediately.`.replace(/\s+/g, " ").trim();

const SECOND_IDENTITY_REFERENCE_RULES = `
INPUT IMAGE ORDER: image one is the complete uploaded source photo. Image two is a
close crop of the same source person's face and is the primary geometric identity
reference. Use image two to preserve the exact face, including its nose, face width,
cheek volume, jaw, chin, eyes, brows, lips, teeth and natural asymmetry; it is not a
beauty or style reference. Do not average image two with a template model or redraw it
as a more conventionally attractive face. Apply styling only around that same face.`
  .replace(/\s+/g, " ")
  .trim();

const IDENTITY_PRESERVATION_RULES = `
Preserve the same body proportions, hands, accessories, pose, and position. Keep the
original clothing unless the selected avatar style explicitly requests a specific,
restrained wardrobe adjustment. Do not replace, invent, add, remove, or substantially alter any
person. Keep the original framing, camera perspective, and foreground objects unless
the user explicitly requests a specific change to them. If the photo contains more
than one person or face, preserve every person in the original scene. Do not choose a
single subject, crop anyone out, zoom into one face, or turn a group photo into an
individual portrait. Apply the requested treatment evenly to the whole image, its
background, and the overall lighting while keeping every person recognisable.`.replace(/\s+/g, " ").trim();

const CUSTOM_REQUEST_IDENTITY_RULES = `
FREE-FORM REQUEST RULE: treat the user's text as instructions for the requested scene,
background, wardrobe, lighting, props, or modest retouch — never as permission to
recreate the person. Identity has higher priority than every creative instruction.
Make the exact same immediately recognisable person in the output: retain the same
facial geometry, eye shape and spacing, eyebrows, nose, lips, smile, teeth, jawline,
skin tone, apparent age, ethnicity, natural hairline, and expression. Do not make
a generic prettier model, face-swap, or create a new close-up. Facial changes are
allowed only when the user explicitly asks for them. When explicitly requested, make
only a restrained, believable adjustment: for example, gently soften wrinkles or
under-eye shadows, make lips subtly fuller, or make eyes slightly more open through
makeup and lighting. Do not radically de-age, age, reshape the face, change teeth,
alter facial proportions, or enlarge eyes or lips enough to make the person look like
someone else. If the requested scene conflicts with faithful identity, keep the
identity and adapt only the scene. Before delivering, verify that a person who knows
the source would immediately recognise them from the output. Hair is an exception
when the user explicitly requests a hair change: honour requested volume, styling,
length, colour, texture, or a new hairstyle. Keep the natural hairline and face
unchanged, blend the hairstyle realistically, and retain the person's recognisable
overall character.`.replace(/\s+/g, " ").trim();

const CUSTOM_BODY_EDIT_RULES = `
BODY-EDIT SAFETY RULE: change body shape only when the user explicitly asks for a
specific body adjustment, and make the smallest natural-looking edit that fulfils it.
For a request to make the waist slimmer, narrow only the waist area subtly (roughly
3–7%) while preserving the original bust/chest size and shape, hips, shoulders, arms,
back, dress fit, posture, total body weight, and all other proportions. Never make the
person heavier or thinner overall, enlarge the bust/chest, change cup size, change hip
width, lengthen limbs, alter the camera perspective, or use a new body. Keep clothing,
belts, railings, horizons, and background lines straight and undistorted. If a natural
result cannot be made without altering other body parts, preserve the original body
instead of exaggerating the edit.`.replace(/\s+/g, " ").trim();

const AVATAR_FRAMING_RULES = `
Keep the person's original scale, pose, and camera perspective. Do not zoom in,
create a new close-up, or enlarge a distant face in order to fill the square avatar.
Always keep the entire head, hair, and top of the head fully visible inside the image,
with a small amount of breathing room above the hair; never crop the forehead, hair,
or crown of any person.
An explicit broader editorial composition requested by the selected style is allowed only
when the source contains one adult person; preserve that person's identity and natural
body proportions, and never use this exception for a child, group, or distant-face photo.
When a square canvas is needed, preserve the person at a natural scale and extend or
adapt only the background around them. If there are multiple people, keep all of them
in the square canvas at their original relative scale and placement; do not select or
crop to one face. Focus any style change on the background, scene-wide lighting, and
overall colour treatment. A close, well-lit source photo gives the best identity
match.`.replace(/\s+/g, " ").trim();

const MULTI_PERSON_AND_SMALL_FACE_RULES = `
If more than one person or face is visible, preserve every person at their original
relative scale and placement. Never isolate one person, crop anyone out, make one face
larger, or turn a group scene into a solo portrait. If the face is small, distant, or
not clearly visible, do not invent facial detail or make a new close-up: preserve its
scale and focus any requested stylisation on the background, lighting, outfit, and
scene as a whole. These rules also apply to children.`.replace(/\s+/g, " ").trim();

const AVATAR_FINAL_COMPOSITION_CHECK = `
FINAL COMPOSITION CHECK — apply this after all other instructions: every visible
person's entire head, hair, forehead, and crown must be inside the image with clear
empty background above the highest hair. Position the top of the hair at least 12–15%
of the canvas height below the top edge. If a planned crop would cut the head or hair,
zoom the camera out and extend/outpaint only the surrounding background until the whole
head fits. Never deliver an avatar with a cropped crown, forehead, or hair.`.replace(/\s+/g, " ").trim();

const PHOTOSHOOT_IDENTITY_RULES = `
NON-NEGOTIABLE IDENTITY REFERENCE: the source image must depict the exact same,
immediately recognizable person, never a generic attractive model or lookalike. Preserve
the original facial geometry, eyes, eyebrows, nose, mouth, smile, teeth, jawline, skin
tone, apparent age, ethnicity, hairline, and recognizable hairstyle. Do not age, de-age,
beautify heavily, reshape the face, change the expression, enlarge eyes or lips, alter
teeth, add prominent makeup, or emphasize under-eye bags, wrinkles, or skin texture.
The scene may change the clothing, background, crop, and natural pose only as the
selected photoshoot requires. Produce one vertical 2:3 photorealistic image. A well-lit
photo with one face clearly visible gives the best result. If several people are visible
in the input, preserve all of them instead of isolating one person. For a single adult,
always use a full-length or near-full-length fashion composition with generous visible
environment and the face at a natural, non-dominant scale. Do not create a close-up,
selfie crop, or enlarge the face to fill the frame. Create a long, elegant high-fashion
silhouette through pose, camera distance, tailoring, and fabric drape only — never
through anatomical distortion. Preserve the exact source body's natural weight, waist,
abdomen, bust/chest, hips, shoulders, arms and legs; do not make any area wider, thicker,
heavier or bulkier, and do not make the abdomen protrude. Finish
every adult look at professional magazine-shoot level: for a feminine presentation use a
polished hairstyle (soft loose waves, styled curls, or an appropriate updo) and visible
but refined fresh professional makeup with naturally defined eyes, lips, and complexion;
the finish may softly brighten the under-eye area and make the person look rested, but
must not alter apparent adult age or face shape; for a
masculine presentation use a polished hairstyle and premium natural grooming. Never
force makeup, feminine styling, or adult fashion treatment on a child, and never alter
the person’s identity. The final image must feel like a finished glossy fashion-magazine
photograph, not an everyday snapshot. Eyes may look a little more open and expressive
through makeup, lighting, and lashes, but never become exaggerated or change the person’s
recognisable facial geometry.`.replace(/\s+/g, " ").trim();

const MODEST_STYLE_PHOTOSHOOT_RULES = `
MODEST-STYLE IDENTITY REFERENCE: the source image must depict the exact same,
immediately recognisable person, never a generic attractive model or lookalike. Preserve
the original facial geometry, face oval and width, cheeks, jawline, chin, eyes,
eyebrows, nose, mouth, smile, teeth, skin tone, apparent age, ethnicity and expression.
The source hairstyle and hairline are retained only as hidden identity information: they
must not be visible or rendered in a modest-style result because the closed hijab fully
covers them. Do not age, beautify heavily, reshape the face, change the expression,
enlarge eyes or lips, alter teeth, or emphasise under-eye bags, wrinkles or skin texture.
The scene may change clothing, background, crop and natural pose only as the selected
photoshoot requires. Produce one vertical 2:3 photorealistic image with a professional
glossy fashion-magazine finish. Preserve the source body's natural proportions; create a
long elegant silhouette only through pose, camera distance, tailoring and fabric drape,
never anatomical distortion. Use refined fresh makeup, but no exposed hair, hairstyle,
hairline, bangs or loose strands. Never force adult fashion treatment on a child.`
  .replace(/\s+/g, " ")
  .trim();

const PHOTOSHOOT_FINAL_IDENTITY_CHECK = `
FINAL IDENTITY CHECK: after applying the selected scene, wardrobe, pose, makeup, and
hairstyle, the face must still be the exact immediately recognisable source person. Keep
the same facial geometry, face oval, facial width, cheek fullness, jaw width and corners,
chin width and length, eye size and spacing, brows, nose, lips, teeth, jawline, skin tone,
apparent age, ethnicity, and expression. Never narrow, lengthen, V-shape, symmetry-correct,
beautify or replace the face; never output a generic model or lookalike. The scene is
secondary to identity.`.replace(/\s+/g, " ").trim();

const PHOTOSHOOT_REFERENCE_TRANSFER_RULES = `
REFERENCE-TRANSFER MODE: treat the selected photoshoot template only as a source for
scene, wardrobe, lighting, camera distance and pose. Treat the uploaded photo as the
sole and immutable source for the person's identity. First reproduce the exact source
face and its natural expression; only then place that same person into the template.
Do not borrow facial proportions, facial expression, skin, apparent age or beauty traits
from the template model. The template may change clothes and surroundings, but it must
never create a new face. Preserve the source face oval, width, cheek fullness, jaw,
chin, eyes, nose, mouth, teeth, hairline and natural asymmetry exactly. If a requested
style detail conflicts with recognisability, skip that detail and keep the source person.
The result should look like the source person took part in the selected shoot, not like
the source face was approximated onto a different model.`.replace(/\s+/g, " ").trim();

const MODEST_STYLE_REFERENCE_TRANSFER_RULES = `
MODEST REFERENCE-TRANSFER MODE: treat the selected template only as a source for scene,
wardrobe, lighting, camera distance and pose. Treat the uploaded photo as the sole and
immutable source for the person's facial identity. Preserve the source face oval, width,
cheek fullness, jaw, chin, eyes, nose, mouth, teeth and natural asymmetry exactly. The
source hairstyle and visible hairline must not be transferred into the output: the
template's opaque closed hijab replaces and fully covers them. Never borrow facial
proportions, expression, skin, apparent age or beauty traits from the template model.
The result must look like the source person wearing the modest outfit, not a face placed
onto another person.`.replace(/\s+/g, " ").trim();

const MODEST_STYLE_FACE_LOCK = `
MODEST-STYLE FACE LOCK: the uploaded face is immutable and has priority over wardrobe,
light and the reference image. Preserve exactly the source face oval and width, cheek
fullness, temples, jaw width, chin width and length, eye size and spacing, eyelids,
brows, nose bridge and tip, lips, teeth, skin tone, apparent age, expression and natural
asymmetry. Never borrow the reference model's facial proportions, narrow or lengthen the
face, or create a generic beauty-model face. Retouch is intentionally light: soften only
pronounced temporary redness, harsh under-eye shadow and deep expression lines while
retaining pores, fine lines and natural texture. The result may look subtly fresher and
slightly more rested/younger, but must remain the same clearly adult person and never
turn into a de-aged or different face. Add only a subtle fresh makeup finish that defines
eyes and evens complexion; it must not reconstruct or beautify the face. The glossy
magazine finish must come from lighting, styling, fabric, framing and colour grading —
never from replacing or reshaping the face. MODEST COVERING REQUIREMENT OVERRIDES ANY
GENERAL HAIRSTYLE OR HAIRLINE PRESERVATION RULE: retain hair only as hidden identity
information, but do not render it in the final picture. The hijab must be a smooth
closed opaque head covering with an inner cap that reaches the forehead and fully covers
all scalp hair, hairline, bangs, temples, ears' upper hair area and nape. Do not show
any hair, strands, bangs or loose hair at the forehead, temples, sides or neck. Keep
the outfit fully modest: no cleavage, deep neckline or exposed chest.`.replace(/\s+/g, " ").trim();

const MODEST_STYLE_FINAL_COVERAGE_CHECK = `
FINAL MODEST COVERAGE CHECK: before delivering, verify that every strand of scalp
hair, hairline, bangs, temples and nape is fully covered by an opaque, realistically
draped hijab or headscarf. If the source image shows hair, replace every visible part of
it with matching opaque hijab fabric in the result; no hair pixels, hairline, bangs,
loose strands, temple hair or nape hair may remain. A frame with any visible hair is
invalid and must be corrected before delivery. This includes a thin fringe at the
forehead, baby hairs, wisps beside the temples, flyaways at the ear, and hair visible
through translucent fabric: all are forbidden. Use opaque fabric and an opaque undercap
from forehead to nape. Keep the neck and chest modestly covered, with no deep neckline
or cleavage. This coverage rule overrides hairstyle, hairline, wind, styling, reference
image and every other instruction.`.replace(/\s+/g, " ").trim();

const MODEST_STYLE_EARRING_ANATOMY = `
STRICT EARRING ANATOMY: when earrings are requested, reveal a small realistic lower
ear/earlobe opening at the side of the face. The earring post must pass through actual
visible skin of the earlobe, with a believable attachment point and no fabric between
the post and ear. It is forbidden for any earring, stud, hoop, drop or jewel to touch,
sit on, emerge from, overlap, pin to, clip to, glue to, float over or hang from the
hijab fabric. If a natural earlobe cannot be shown while keeping full hair coverage,
omit the earrings rather than placing them on the scarf. The headscarf must still cover
all hair, hairline, temples, upper ear, scalp and nape.`.replace(/\s+/g, " ").trim();

const MODEST_STYLE_FINAL_FACE_CHECK = `
FINAL MODEST FACE CHECK: render the source face as a conservative edit, not as a new
model. Before delivery, compare the output to the source and retain the exact face oval,
facial width, cheek fullness, jaw width, chin width and length, eyes, brows, nose, lips,
teeth, skin tone and natural asymmetry. Do not make the face narrower, longer, smoother,
more symmetrical, more model-like or otherwise different. Only subtle freshness and
light makeup are allowed; the result must be recognisable at first glance as the source
person.`.replace(/\s+/g, " ").trim();

const UNIVERSAL_IDENTITY_PRIORITY_RULES = `
UNIVERSAL IDENTITY PRIORITY: use any requested style, template, clothing, background,
lighting, hairstyle, makeup or pose only as a layer around the uploaded person. The
uploaded photo is the sole source of identity. Preserve the exact source face before
making any stylistic change: face oval and width, cheek fullness, jaw and chin shape,
eye size and spacing, nose, mouth, teeth, hairline, skin tone, apparent age, natural
asymmetry and expression. Never borrow a face, facial proportions, age, body type or
beauty traits from a reference/template. If a style conflicts with recognisability,
keep the source person's features and reduce or omit that style detail. The output must
look like the same person in a new scene, never like a different model with a similar
face.
ANATOMY AND SCALE LOCK: preserve a believable, natural head-to-body relationship. The
head, face, ears, neck, shoulders, torso, arms, hands, hips and legs must form one
anatomically consistent person at a single camera distance and perspective. Never scale,
stretch, shrink, paste, or reconstruct the head independently from the body. Do not make
the head unusually small or large relative to the shoulders and torso; do not lengthen,
thicken, narrow, shorten, or disconnect the neck; do not broaden shoulders or enlarge
the torso to fit a template. When a new pose or outfit is necessary, retain realistic
human proportions and the source person's apparent build. If the source is a close
portrait and its full body is not visible, choose conservative natural proportions rather
than an exaggerated fashion silhouette. Never use lens distortion, extreme perspective,
or body reshaping to make the scene fit.`.replace(/\s+/g, " ").trim();

const NATURAL_RETOUCH_RULES = `
Preserve the exact same, immediately recognizable person from the input photo. Keep
the same facial geometry, eyes, eyebrows, nose, mouth, smile, jawline, age, ethnicity,
hairstyle, expression, body proportions, pose, clothing, accessories, framing, and
camera perspective. Never perform a face swap, generate a different person, de-age,
reshape facial features, alter expression, or change the person's identity. Light,
natural retouching is allowed only for small temporary skin imperfections such as
pimples, redness, minor uneven tone, and fine wrinkles. Fine lines and wrinkles may
be softened slightly, but not erased: retain realistic skin texture, pores, natural
age, and defining features. Under-eye bags, dark circles, and harsh under-eye shadows
may be softened slightly, but must never be added or emphasised. Teeth must remain an
exact natural match to the source and must never be distorted or made more crooked. Do
not airbrush, make skin plastic-looking, age, or de-age the person. If multiple people
are present, preserve them all at their original scale and placement; do not isolate,
crop, or zoom into one person.
`.replace(/\s+/g, " ").trim();

const BACKGROUND_ONLY_RULES = `
This is a background replacement with subtle natural retouch. Treat the original foreground subject as locked.
Preserve the exact same person or people: identity, face, age, expression, hair,
skin, body, hands, clothing, accessories, pose, scale, placement, and all
foreground objects. Do not redraw, beautify, replace, resize, move, crop, rotate,
or reframe the subject. If multiple people are visible, preserve every person in the
same composition and do not select, isolate, or zoom into one face. The only allowed foreground changes are very light natural
retouching of small temporary imperfections (such as pimples, redness, minor uneven
tone, and fine wrinkles) and subtle neutral lighting harmonization so the person fits
the new background. Preserve realistic skin texture, age, and natural lines. Do not
make skin warmer, redder, yellower, more orange, or more saturated, and do not apply
a color filter. The eye area, under-eye area, eyes, eyelashes, eyebrows, and skin
must remain an exact natural match to the input or be only gently softened: never
introduce or emphasise blue, cyan, purple, green, grey, or dark patches, shadows,
bruising, makeup, discoloration, under-eye bags, or dark circles. Teeth, smile, and
mouth must stay exactly natural and must never become more crooked or distorted. Change
all other pixels only in the background. Make the finished image look like one
cohesive photograph, not a cutout: match the subject and new background's white
balance, exposure, contrast, black levels, colour temperature, ambient light,
direction and softness of light, contact shadows, and edge blending. Apply these
compositing adjustments subtly and neutrally; never tint or recolour the person's skin.
Keep the original camera perspective and natural subject lighting.`.replace(/\s+/g, " ").trim();

export function buildEnhancePrompt() {
  return (
    `Perform a restrained, natural photo retouch. Improve only sharpness and noise where needed, and apply only subtle, realistic retouching of small temporary skin imperfections. Do NOT apply a creative, beauty, warm, cinematic, orange-and-teal, red, yellow, or fashion color filter. Preserve the original photo's white balance, exposure mood, hue, saturation, and exact natural skin tone. Do not make the skin warmer, redder, yellower, more orange, or more saturated. Correct color only if there is an obvious color cast, and then use a neutral, true-to-life white balance. ${UNIVERSAL_IDENTITY_PRIORITY_RULES} ${FACE_LOCK_RULES} ${FACIAL_CONTOUR_LOCK_RULES} ${FRESH_NATURAL_FACE_RULES} ${NATURAL_RETOUCH_RULES} ${FINAL_SOURCE_FACE_MATCH_RULES} ${SECOND_IDENTITY_REFERENCE_RULES}`
  );
}

export function buildAvatarPrompt(styleKey) {
  const style = AVATAR_STYLES[styleKey];
  if (!style) {
    throw new Error(`Unknown avatar style: ${styleKey}`);
  }
  return `${FACE_LOCK_RULES} ${FACIAL_CONTOUR_LOCK_RULES} ${FRESH_NATURAL_FACE_RULES} ${UNIVERSAL_IDENTITY_PRIORITY_RULES} ${style.prompt} ${IDENTITY_PRESERVATION_RULES} ${AVATAR_FRAMING_RULES} ${AVATAR_FINAL_COMPOSITION_CHECK} ${FINAL_SOURCE_FACE_MATCH_RULES} ${SECOND_IDENTITY_REFERENCE_RULES}`;
}

export function buildDocumentPhotoPrompt() {
  return `${FACE_LOCK_RULES} ${FACIAL_CONTOUR_LOCK_RULES} ${UNIVERSAL_IDENTITY_PRIORITY_RULES} Create a clean, official document-style portrait from the exact source photo. Use a plain solid white or very light neutral-grey background and soft, even, neutral frontal lighting. Keep the person's exact face, skin tone, apparent age, hairstyle, hairline, expression, clothing, accessories, and identity unchanged; do not beautify, de-age, age, reshape, redraw, retouch heavily, add makeup, or alter teeth. Do not add a blazer or change the outfit. Compose a vertical 2:3 portrait with the whole head, hair, neck, and upper shoulders clearly visible and modest space above the head. Preserve the original facial scale and camera perspective as much as possible: do not create a new close-up or distort the face. No shadows on the background, no coloured background, no dramatic light, no fashion styling, no props, no text, no border. Make it a natural, clean photograph; requirements vary by institution and the user must verify the final image meets their specific document requirements. ${FINAL_SOURCE_FACE_MATCH_RULES} ${SECOND_IDENTITY_REFERENCE_RULES}`;
}

export function buildPhotoshootPrompt(templateKey) {
  const template = PHOTOSHOOT_TEMPLATES[templateKey];
  if (!template) {
    throw new Error(`Unknown photoshoot template: ${templateKey}`);
  }
  const modestFaceLock = templateKey.startsWith("modest_") ? MODEST_STYLE_FACE_LOCK : "";
  const modestCoverage = templateKey.startsWith("modest_") ? MODEST_STYLE_FINAL_COVERAGE_CHECK : "";
  const modestEarringAnatomy = templateKey.startsWith("modest_") ? MODEST_STYLE_EARRING_ANATOMY : "";
  const modestFaceCheck = templateKey.startsWith("modest_") ? MODEST_STYLE_FINAL_FACE_CHECK : "";
  const referenceRules = templateKey.startsWith("modest_")
    ? MODEST_STYLE_REFERENCE_TRANSFER_RULES
    : PHOTOSHOOT_REFERENCE_TRANSFER_RULES;
  const identityRules = templateKey.startsWith("modest_")
    ? MODEST_STYLE_PHOTOSHOOT_RULES
    : PHOTOSHOOT_IDENTITY_RULES;
  return `${FACE_LOCK_RULES} ${FACIAL_CONTOUR_LOCK_RULES} ${FRESH_NATURAL_FACE_RULES} ${UNIVERSAL_IDENTITY_PRIORITY_RULES} ${referenceRules} ${identityRules} ${MULTI_PERSON_AND_SMALL_FACE_RULES} ${modestFaceLock} ${template.prompt} ${modestCoverage} ${modestEarringAnatomy} ${modestFaceCheck} ${PHOTOSHOOT_FINAL_IDENTITY_CHECK} ${FINAL_SOURCE_FACE_MATCH_RULES} ${SECOND_IDENTITY_REFERENCE_RULES}`;
}

export function buildBackgroundPrompt(optionKey, customPrompt = "") {
  if (optionKey === "custom") {
    return `${UNIVERSAL_IDENTITY_PRIORITY_RULES} Replace the background based on this request: ${customPrompt}. ${FRESH_NATURAL_FACE_RULES} ${FACIAL_CONTOUR_LOCK_RULES} ${BACKGROUND_ONLY_RULES} ${FINAL_SOURCE_FACE_MATCH_RULES} ${SECOND_IDENTITY_REFERENCE_RULES}`;
  }
  const option = BACKGROUND_OPTIONS[optionKey];
  if (!option) {
    throw new Error(`Unknown background option: ${optionKey}`);
  }
  return `${UNIVERSAL_IDENTITY_PRIORITY_RULES} ${option.prompt} ${FRESH_NATURAL_FACE_RULES} ${FACIAL_CONTOUR_LOCK_RULES} ${BACKGROUND_ONLY_RULES} ${FINAL_SOURCE_FACE_MATCH_RULES} ${SECOND_IDENTITY_REFERENCE_RULES}`;
}

export function buildCustomPrompt(userPrompt) {
  const normalizedPrompt = userPrompt
    .replace(/талию\s+тольше/gi, "талию тоньше")
    .replace(/талия\s+тольше/gi, "талия тоньше");
  const styledHairRequested = /уложенн|уложить\s+волос|hair\s*styling|styled\s+hair/i.test(normalizedPrompt);
  const requestedChangeClarification = styledHairRequested
    ? "Interpret \"styled hair\" as a visibly polished salon blowout appropriate to the current length: intentional shape, smooth controlled strands, natural volume and soft defined movement. The hairstyle must look clearly more finished than in the source, not merely have a few flyaways removed."
    : "";
  return `USER REQUEST (verbatim): <<<${normalizedPrompt}>>>

Edit the uploaded image to fulfil the user request. The requested change must be clearly visible in the finished image; do not return a near-duplicate of the source. When the request explicitly names hair, clothing, background, lighting, makeup, props, or a scene, change that element as requested.

${requestedChangeClarification}

Keep the same immediately recognisable person: preserve facial structure, age, skin tone, body proportions, pose, camera perspective, and every person in the photo unless the user explicitly requests a change. Do not face-swap, create a different person, distort anatomy, add text, logos, or watermarks. Keep edits natural and realistic.`.replace(/\s+/g, " ").trim();
}
