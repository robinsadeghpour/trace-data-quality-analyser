import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from '../routes';

export const useDocumentTitle = (): string => {
  const location = useLocation();
  const title = 'Trace Data Quality Analyser';
  const route = routes.find((r) => r.path === location.pathname);

  useEffect(() => {
    if (route?.label && route.path !== '/') {
      document.title = `${route.label} | ${title}`;
    } else {
      document.title = title;
    }
  }, [route]);

  return route?.label || title;
};
