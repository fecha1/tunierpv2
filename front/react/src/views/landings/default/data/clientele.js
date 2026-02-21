// @project
import branding from '@/branding.json';
import { DynamicComponentType } from '@/enum';

export const clientele = {
  title: `${branding.brandName} accompagne plus de 1 000 entreprises tunisiennes dans leur transformation digitale.`,
  clienteleList: [
    { image: { component: 'clientele/Techlify', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Marketly', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Realtor', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Financely', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Techlify', type: DynamicComponentType.IMAGE } }
  ]
};

export const clientele2 = {
  title: '4,000+ companies already growing',
  clienteleList: [
    { image: { component: 'clientele/Techlify', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Marketly', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Realtor', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Financely', type: DynamicComponentType.IMAGE } },
    { image: { component: 'clientele/Realtor', type: DynamicComponentType.IMAGE } }
  ]
};
