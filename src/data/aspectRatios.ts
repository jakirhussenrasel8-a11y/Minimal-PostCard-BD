import { AspectRatioOption } from '../types';

export const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: 'postcard',
    name: 'Postcard',
    nameBn: 'পোস্টকার্ড (৪:৩)',
    ratio: '4/3',
    width: 1200,
    height: 900,
  },
  {
    id: 'square',
    name: 'Instagram Square',
    nameBn: 'ইন্সটাগ্রাম স্কয়ার (১:১)',
    ratio: '1/1',
    width: 1080,
    height: 1080,
  },
  {
    id: 'story',
    name: 'Instagram Story',
    nameBn: 'ইন্সটাগ্রাম স্টোরি (৯:১৬)',
    ratio: '9/16',
    width: 1080,
    height: 1920,
  },
  {
    id: 'facebook',
    name: 'Facebook Post',
    nameBn: 'ফেসবুক পোস্ট (৪:৫)',
    ratio: '4/5',
    width: 1080,
    height: 1350,
  },
  {
    id: 'status',
    name: 'WhatsApp Status',
    nameBn: 'হোয়াটসঅ্যাপ স্ট্যাটাস (৯:১৬)',
    ratio: '9/16',
    width: 1080,
    height: 1920,
  },
];
