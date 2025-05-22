// utils/masks.ts
import IMask from 'imask';

export const applyPhoneMask = (element: HTMLInputElement) => {
  IMask(element, {
    mask: '(00) 00000-0000',
  });
};

export const applyCpfMask = (element: HTMLInputElement) => {
  IMask(element, {
    mask: '000.000.000-00',
  });
};
