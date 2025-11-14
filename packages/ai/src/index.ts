export type Persona = 'grumpy' | 'rude' | 'nonchalant' | 'funny';
export interface PetMemory { sizes?: string[]; colors?: string[]; budgetNgn?: number }
export interface PetReply { text: string; persona: Persona }

export function replyForPersona(persona: Persona, text: string): PetReply {
  const map: Record<Persona, (t: string) => string> = {
    grumpy: (t) => `Hmph. ${t}? Try the hoodie. Reliable.`,
    rude: (t) => `Tch. ${t}? Just buy the tee already.`,
    nonchalant: (t) => `Okay. ${t}. The tee is fine.`,
    funny: (t) => `Lol ${t}. Hoodie so warm it has feelings.`,
  };
  return { text: map[persona](text), persona };
}












