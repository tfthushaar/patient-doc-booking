/**
 * Environment validation utility
 * Ensures all required environment variables are set before the app runs
 */

interface ValidationError {
  missing: string[];
  errors: string[];
}

export function validateEnvironment(): ValidationError {
  const errors: ValidationError = {
    missing: [],
    errors: [],
  };

  const required = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
  ];

  required.forEach((key) => {
    const value = import.meta.env[key as keyof ImportMetaEnv];
    if (!value) {
      errors.missing.push(key);
    }
  });

  // Validate Supabase URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes("supabase.co")) {
    errors.errors.push("VITE_SUPABASE_URL must be a valid Supabase URL");
  }

  // Validate Supabase key format (should be a valid JWT-like string)
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (supabaseKey && supabaseKey.length < 20) {
    errors.errors.push("VITE_SUPABASE_ANON_KEY appears to be invalid");
  }

  return errors;
}

export function hasEnvironmentErrors(): boolean {
  const validation = validateEnvironment();
  return validation.missing.length > 0 || validation.errors.length > 0;
}

export function getEnvironmentErrorMessage(): string {
  const validation = validateEnvironment();
  const messages: string[] = [];

  if (validation.missing.length > 0) {
    messages.push(
      `Missing environment variables: ${validation.missing.join(", ")}`
    );
  }

  if (validation.errors.length > 0) {
    messages.push(`Configuration errors: ${validation.errors.join(", ")}`);
  }

  return messages.join("\n");
}

