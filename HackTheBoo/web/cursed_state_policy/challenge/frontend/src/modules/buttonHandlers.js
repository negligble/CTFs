import { handleIncomingAction } from "@/modules/socketConnection";
import { analyzeAndDisplayCSP } from "@/modules/cspAnalyzer";
import { loadSampleCSP } from "./cspAnalyzer";

export function setupButtonHandlers() {
  const unsafePolicyButton = document.getElementById('unsafePolicyButton');
  const safePolicyButton = document.getElementById('safePolicyButton');
  const triggerButton = document.getElementById('triggerButton');
  const analyzeButton = document.getElementById('analyzeButton');

  if (triggerButton) {
    triggerButton.addEventListener('click', () => {
      const xssContent = window.codeMirrorEditors['xssEditor'].getValue().trim();
      handleIncomingAction('trigger-xss', xssContent);
    });
  }

  if (analyzeButton) {
    analyzeButton.addEventListener('click', analyzeAndDisplayCSP);
  }

  if (unsafePolicyButton) {
    unsafePolicyButton.addEventListener('click', () => loadSampleCSP('unsafe'));
  }

  if (safePolicyButton) {
    safePolicyButton.addEventListener('click', () => loadSampleCSP('safe'));
  }
}