import { DesktopProvider } from '@/context/DesktopContext';
import Desktop from '@/components/desktop/Desktop';

export default function Page() {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
}
