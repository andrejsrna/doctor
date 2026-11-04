// Marketing copy for the Printful products, keyed by the slug of the Printful product name.
// Every fact here (fabric, weight, fit, print method, placement) was checked against the Printful
// catalogue and the product's print placements; keep it true when editing.
// A product without an entry still sells, with its Printful name and material list.

export type MerchCopy = {
  /** Short code printed on the product's "prescription" tag */
  code: string
  tagline: string
  pitch: string
  /** Print method and placement, shown above the Printful material list */
  print: string
  /** Optional lifestyle photo (public path) shown as the main image, before the Printful mockups */
  photo?: { src: string; alt: string }
}

export const MERCH_COPY: Record<string, MerchCopy> = {
  'doc-hoodie': {
    code: 'DOC-HD',
    tagline: 'The full dose.',
    pitch:
      '350 g organic cotton with a soft suede-touch finish, cut relaxed so it hangs right over anything. A small DnB Doctor crest on the chest, and across the whole back the heart-speaker artwork: an anatomical heart wired straight into a sub cone. Built for cold smoking areas, 6 a.m. walks home and every studio night in between.',
    print: 'Crest on the chest, full-size artwork across the back',
  },
  'doc-tee-basic': {
    code: 'DOC-TS',
    tagline: 'Built for the front row.',
    pitch:
      'A light, breathable mesh jersey that keeps up when the room hits thirty degrees and the drop lands. The same crest on the chest and the same heart-speaker artwork across the back, with an extended length that stays put when you move. The tee for long sets, festival weekends and the session after.',
    print: 'Crest on the chest, full-size artwork across the back',
    photo: { src: '/merch/doc-tee-worn.webp', alt: 'DnB Doctor tee worn from the back, showing the heart-speaker artwork' },
  },
  'doc-beanie': {
    code: 'DOC-BN',
    tagline: 'Winter rotation.',
    pitch: 'A cuffed knit beanie with the DnB Doctor crest stitched on the front. For winter festivals, cold queues outside the club and the walk home after close.',
    print: 'Embroidered crest on the front',
  },
  'dnb-doc-bucket': {
    code: 'DOC-BK',
    tagline: 'Open-air cover.',
    pitch: 'The bucket hat for open-air stages, daylight after-parties and anyone who prefers to rave with their eyes in the shade. Black, with the crest on the front, in two sizes so it actually fits.',
    print: 'Crest printed on the front · sizes S/M and M/L',
  },
  'doc-hat': {
    code: 'DOC-CP',
    tagline: 'Low profile, loud crest.',
    pitch: 'A classic dad hat in soft cotton twill: unstructured six-panel, curved brim, adjustable strap with an antique buckle and the DnB Doctor crest up front. Goes with everything, including the 4 a.m. look.',
    print: 'Crest printed on the front',
  },
}
