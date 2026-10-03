import type { VariantGroup } from './parts'

/**
 * Händler-Auswahl je Produkt (Stand der Händlerseiten 09/2026): Vorlage für
 * „Beim Händler wählen“ und die Variantennamen beim Händler je Unterauswahl.
 * Die Produkte in der Datenbank haben dieselben Werte (`shopChoice`, `shopLabel`)
 * und sind dort im Admin pflegbar – diese Liste ergänzt nur den Standardkatalog.
 */
export const DEFAULT_SHOP_CHOICES: Record<string, { template: string; labels: Record<string, Record<string, string>> }> = {
  "frame-bxt-pro-145": {
    "template": "„{size}cm {finish}“ · Farbe nach Wunsch (z. B. „BXT Black“)",
    "labels": {
      "finish": {
        "matt": "Matte",
        "glossy": "Gloss"
      }
    }
  },
  "frame-bxt-gravel-135": {
    "template": "„{size}cm {finish}“ · Farbe nach Wunsch (z. B. „BXT Black“)",
    "labels": {
      "finish": {
        "matt": "Matte",
        "glossy": "Gloss"
      }
    }
  },
  "frame-spcycle-r088": {
    "template": "„{color}“ · „Size {size}cm {finish}“",
    "labels": {
      "finish": {
        "matt": "Matt",
        "glossy": "Glossy"
      },
      "color": {
        "black": "Black Color",
        "ud-carbon": "UD Carbon",
        "solid": "Solid Color",
        "metallic": "Metallic Paint",
        "chameleon-blue": "Chameleon Blue",
        "chameleon-green": "Chameleon Green",
        "chameleon-purple": "Chameleon Purple"
      }
    }
  },
  "groupset-ltwoo-er7": {
    "template": "„{crankLength}-5034-12s32T“",
    "labels": {}
  },
  "groupset-ltwoo-grt12": {
    "template": "„{cassette}“ · „{chainring}T“ · „{bottomBracket}“ · „{crankLength}mm“",
    "labels": {
      "cassette": {
        "silver-11-46": "Silver 12s 11-46T",
        "silver-11-50": "Silver 12s 11-50T",
        "black-11-50": "Black 12s 11-50T",
        "gold-11-50": "Gold 12s 11-50T"
      },
      "bottomBracket": {
        "bsa": "BSA",
        "bb86": "BB86 92",
        "pf30": "PF30",
        "bb30": "BB30"
      }
    }
  },
  "groupset-ltwoo-r9": {
    "template": "„{cassette}“ · „{chainring}“ · „{bottomBracket}“ · „{crankLength}mm“",
    "labels": {
      "cassette": {
        "11-28": "11s 11-28 Cassette",
        "11-30": "11s 11-30 Cassette",
        "11-32": "11s 11-32 Cassette",
        "11-34": "11s 11-34 Cassette"
      },
      "chainring": {
        "50-34": "50-34T",
        "52-36": "52-36T",
        "53-39": "53-39T"
      },
      "bottomBracket": {
        "bsa": "BSA",
        "bb86": "BB86 92",
        "pf30": "PF30",
        "bb30": "BB30"
      }
    }
  },
  "wheels-elitewheels-ent-2-0": {
    "template": "„{rimDepth}“ · „{bearing}“ · „12x100mm 12x142mm“ · „{freehub}“ · „Center Lock“",
    "labels": {
      "rimDepth": {
        "30": "30mm depth 28mm",
        "38": "38mm depth 28mm",
        "50": "50mm depth 28mm",
        "55": "55mm depth 31mm",
        "60": "60mm depth 28mm",
        "82": "82mm depth 31mm"
      },
      "bearing": {
        "steel": "Steel Bearing",
        "ceramic": "Ceramic Bearing"
      },
      "freehub": {
        "shimano-hg": "SHIMAN0 HG 10-11-12S",
        "sram-xdr": "SRAM XDR 12S",
        "shimano-ms": "SHIMAN0 MS 12S"
      }
    }
  },
  "wheels-elitewheels-slr-gravel": {
    "template": "„{bearing}“ · „Tubeless compatible“ · „Black Decal“ · „{rimDepth}“ · „{freehub}“",
    "labels": {
      "rimDepth": {
        "35": "35mm depth 34mm",
        "38": "38mm depth 32.5mm",
        "45": "45mm depth 34mm"
      },
      "bearing": {
        "steel": "Steel Bearing",
        "ceramic": "Ceramic Bearing"
      },
      "freehub": {
        "shimano-hg": "SHIMAN0 10-11-12S"
      }
    }
  },
  "wheels-elitewheels-aero-tt": {
    "template": "„ROAD WHEELS“ · „Tubeless compatible“",
    "labels": {}
  },
  "wheels-rujixu-rd300": {
    "template": "„700C deep {rimDepth}mm“ · „HG“ · „TA100x12 142x12“ · „{hub}“ · „Center lock“",
    "labels": {
      "hub": {
        "pawls": "6 Pawls",
        "ratchet": "36T Ratchet"
      }
    }
  }
}

/** Ergänzt Händler-Auswahl und -Variantennamen, wo sie noch fehlen. */
export function withShopChoices<T extends { id: string; shopChoice?: string; variants?: VariantGroup[] }>(parts: T[]): T[] {
  return parts.map((part) => {
    const choice = DEFAULT_SHOP_CHOICES[part.id]
    if (!choice) return part
    return {
      ...part,
      shopChoice: part.shopChoice ?? choice.template,
      variants: part.variants?.map((group) => ({
        ...group,
        options: group.options.map((option) => ({
          ...option,
          shopLabel: option.shopLabel ?? choice.labels[group.id]?.[option.id],
        })),
      })),
    }
  })
}
