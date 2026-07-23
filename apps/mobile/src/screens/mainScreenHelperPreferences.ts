import type {
  ApprovalMode,
  ApprovalPolicy,
  ReasoningEffort,
  ServiceTier,
} from '../api/types';
import type { SelectedServiceTier } from './mainScreenHelperTypes';

export function normalizeModelId(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeReasoningEffort(
  effort: string | null | undefined
): ReasoningEffort | null {
  if (typeof effort !== 'string') {
    return null;
  }

  const normalized = effort.trim().toLowerCase();
  if (
    normalized === 'none' ||
    normalized === 'minimal' ||
    normalized === 'low' ||
    normalized === 'medium' ||
    normalized === 'high' ||
    normalized === 'xhigh' ||
    normalized === 'max'
  ) {
    return normalized;
  }

  return null;
}

export function normalizeServiceTier(
  serviceTier: string | null | undefined
): ServiceTier | null {
  if (typeof serviceTier !== 'string') {
    return null;
  }

  const normalized = serviceTier.trim().toLowerCase();
  if (normalized === 'flex' || normalized === 'fast') {
    return normalized;
  }

  return null;
}

export function toSelectedServiceTier(
  serviceTier: ServiceTier | null | undefined
): ServiceTier | null {
  return serviceTier === 'fast' ? 'fast' : null;
}

export function resolveSelectedServiceTier(
  selectedServiceTier: SelectedServiceTier,
  defaultServiceTier: ServiceTier | null | undefined
): ServiceTier | null {
  if (selectedServiceTier !== undefined) {
    return toSelectedServiceTier(selectedServiceTier);
  }

  return toSelectedServiceTier(defaultServiceTier);
}

export function toApprovalPolicyForMode(mode: ApprovalMode | null | undefined): ApprovalPolicy {
  return mode === 'yolo' ? 'never' : 'untrusted';
}

export function shouldSurfaceChatLoadError(
  revalidate: boolean | undefined,
  cachedChatId: string | null | undefined,
  requestedChatId: string,
  cachedMessageCount: number
): boolean {
  return !(
    revalidate === true &&
    cachedChatId === requestedChatId &&
    cachedMessageCount > 0
  );
}
