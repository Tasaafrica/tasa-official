/**
 * Email domain validation and typo detection utility.
 * Helps prevent users from registering or requesting OTPs with mistyped email domains (e.g. "gamil.com").
 */

export interface EmailDomainSuggestion {
  original: string;
  suggested: string;
  originalDomain: string;
  suggestedDomain: string;
}

/**
 * Common major email providers.
 */
export const POPULAR_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "ymail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "icloud.com",
  "me.com",
  "live.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "mail.com",
];

/**
 * Common TLD misspellings mapped to correct TLDs.
 */
export const COMMON_TLD_TYPOS: Record<string, string> = {
  ".con": ".com",
  ".cpm": ".com",
  ".comm": ".com",
  ".coom": ".com",
  ".vom": ".com",
  ".xom": ".com",
  ".col": ".com",
  ".ocm": ".com",
  ".ner": ".net",
  ".ne": ".net",
  ".ogr": ".org",
  ".or": ".org",
};

/**
 * Direct lookup dictionary for common domain typos.
 */
export const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  // Gmail typos
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmaik.com": "gmail.com",
  "gmaol.com": "gmail.com",
  "gmaul.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gamail.com": "gmail.com",
  "gemail.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaii.com": "gmail.com",
  "gmaiil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gamil.co": "gmail.com",
  "gmai.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmaild.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cpm": "gmail.com",
  "gmail.vom": "gmail.com",
  "gmail.xom": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.comm": "gmail.com",
  "gmail.coom": "gmail.com",
  "gmeil.com": "gmail.com",
  "gmael.com": "gmail.com",
  "gmaill.co": "gmail.com",
  "gmaill.con": "gmail.com",
  "gimail.com": "gmail.com",
  "gmai.com.ng": "gmail.com",

  // Yahoo typos
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhaoo.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yahoo.cpm": "yahoo.com",
  "yaho.co": "yahoo.com",
  "yaho.cm": "yahoo.com",
  "yahoo.comm": "yahoo.com",
  "yahoo.coom": "yahoo.com",
  "yahou.com": "yahoo.com",
  "uahoo.com": "yahoo.com",
  "yahoou.com": "yahoo.com",
  "ymail.co": "ymail.com",
  "ymail.con": "ymail.com",

  // Hotmail typos
  "hotmial.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmali.com": "hotmail.com",
  "hotmaik.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.cpm": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "hotamail.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "hotmaill.co": "hotmail.com",

  // Outlook typos
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outllok.com": "outlook.com",
  "ootlook.com": "outlook.com",
  "outlook.co": "outlook.com",
  "outlock.com": "outlook.com",
  "outlook.cm": "outlook.com",
  "outlook.con": "outlook.com",
  "outlook.cpm": "outlook.com",
  "outook.com": "outlook.com",
  "outllook.com": "outlook.com",
  "putlook.com": "outlook.com",

  // iCloud typos
  "iclud.com": "icloud.com",
  "icloude.com": "icloud.com",
  "icloud.co": "icloud.com",
  "icoud.com": "icloud.com",
  "icloud.cm": "icloud.com",
  "icloud.con": "icloud.com",
  "icld.com": "icloud.com",
  "iclaud.com": "icloud.com",

  // Proton typos
  "protonmal.com": "protonmail.com",
  "portonmail.com": "protonmail.com",
  "protonmial.com": "protonmail.com",
  "proton.com": "proton.me",

  // Live typos
  "liv.com": "live.com",
  "live.co": "live.com",
  "live.con": "live.com",
};

/**
 * Calculates the Damerau-Levenshtein distance between two strings,
 * which accounts for insertions, deletions, substitutions, and transpositions.
 */
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix: number[][] = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let min = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );

      // transposition of two adjacent characters
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        min = Math.min(min, matrix[i - 2][j - 2] + cost);
      }

      matrix[i][j] = min;
    }
  }

  return matrix[al][bl];
}

/**
 * Checks an email string for domain typos and returns a suggestion if a likely typo is detected.
 */
export function getEmailDomainSuggestion(
  email: string,
): EmailDomainSuggestion | null {
  if (!email || typeof email !== "string") return null;

  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex === -1 || atIndex === 0 || atIndex === trimmed.length - 1) {
    return null;
  }

  const localPart = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  // If domain is already one of the exact popular domains, it's not a typo
  if (POPULAR_DOMAINS.includes(domain)) {
    return null;
  }

  // 1. Direct typo dictionary check (fastest)
  if (COMMON_DOMAIN_TYPOS[domain]) {
    const suggestedDomain = COMMON_DOMAIN_TYPOS[domain];
    return {
      original: trimmed,
      suggested: `${localPart}@${suggestedDomain}`,
      originalDomain: domain,
      suggestedDomain,
    };
  }

  // 2. Common TLD typo check (e.g. .con, .comm -> .com)
  for (const [typoTld, correctTld] of Object.entries(COMMON_TLD_TYPOS)) {
    if (domain.endsWith(typoTld)) {
      const baseDomain = domain.slice(0, -typoTld.length);
      const suggestedDomain = baseDomain + correctTld;
      return {
        original: trimmed,
        suggested: `${localPart}@${suggestedDomain}`,
        originalDomain: domain,
        suggestedDomain,
      };
    }
  }

  // 3. Damerau-Levenshtein distance check against popular domains
  for (const popDomain of POPULAR_DOMAINS) {
    if (Math.abs(domain.length - popDomain.length) <= 2) {
      const dist = damerauLevenshtein(domain, popDomain);
      if (dist === 1) {
        return {
          original: trimmed,
          suggested: `${localPart}@${popDomain}`,
          originalDomain: domain,
          suggestedDomain: popDomain,
        };
      }
    }
  }

  return null;
}

/**
 * Returns true if the email domain looks like a typo.
 */
export function isEmailDomainTypo(email: string): boolean {
  return getEmailDomainSuggestion(email) !== null;
}

/**
 * Validates whether an email has a clean, non-typo domain.
 */
export function validateEmailDomain(email: string): {
  isValid: boolean;
  error?: string;
  suggestion?: EmailDomainSuggestion;
} {
  const suggestion = getEmailDomainSuggestion(email);
  if (suggestion) {
    return {
      isValid: false,
      error: `Did you mean ${suggestion.suggested}? '${suggestion.originalDomain}' appears to be a typo.`,
      suggestion,
    };
  }
  return { isValid: true };
}
