// @mui
import Typography from '@mui/material/Typography';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  SAMPLE PAGE  ***************************/

export default function SamplePage() {
  return (
    <ComponentsWrapper title="Sample Page">
      <PresentationCard title="Basic Card">
        <Typography variant="body2" color="text.secondary">
          TuniERP offre une solution ERP complète et modulaire. Vous pouvez personnaliser chaque module selon vos besoins : facturation,
          stock, CRM, comptabilité et bien plus. Commencez par les modules essentiels et ajoutez-en au fur et à mesure.
        </Typography>
      </PresentationCard>
    </ComponentsWrapper>
  );
}
