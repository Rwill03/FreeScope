/**
 * Form validation utilities
 */

export type ValidationResult = { valid: true } | { valid: false; error: string };

export function validateProjectName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: "Project name is required" };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Project name must be at least 2 characters" };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Project name must be 100 characters or less" };
  }
  return { valid: true };
}

export function validateProjectDescription(description: string): ValidationResult {
  if (description.trim().length > 500) {
    return { valid: false, error: "Description must be 500 characters or less" };
  }
  return { valid: true };
}

export function validateRole(role: string): ValidationResult {
  const trimmed = role.trim();
  if (!trimmed) {
    return { valid: false, error: "Role is required" };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Role must be at least 2 characters" };
  }
  return { valid: true };
}

export function validateHourlyRate(rate: string): ValidationResult {
  const parsed = parseFloat(rate);
  if (isNaN(parsed)) {
    return { valid: false, error: "Hourly rate must be a valid number" };
  }
  if (parsed < 0) {
    return { valid: false, error: "Hourly rate must be positive" };
  }
  if (parsed > 10000) {
    return { valid: false, error: "Hourly rate seems too high (max 10000)" };
  }
  return { valid: true };
}

export function validateYearsExperience(years: string): ValidationResult {
  const parsed = parseInt(years, 10);
  if (isNaN(parsed)) {
    return { valid: false, error: "Years must be a valid number" };
  }
  if (parsed < 0) {
    return { valid: false, error: "Years must be 0 or more" };
  }
  if (parsed > 100) {
    return { valid: false, error: "Years seems too high" };
  }
  return { valid: true };
}

export function validateFeatureDescription(description: string): ValidationResult {
  const trimmed = description.trim();
  if (!trimmed) {
    return { valid: false, error: "Feature description is required" };
  }
  if (trimmed.length < 10) {
    return { valid: false, error: "Feature description must be at least 10 characters" };
  }
  if (trimmed.length > 2000) {
    return { valid: false, error: "Feature description must be 2000 characters or less" };
  }
  return { valid: true };
}
