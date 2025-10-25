import { Router } from 'express';
import { TRoutes } from '../../types/route';

/**
 * Injects routes into a router
 */
export function injectRoutes(router: Router, routes: TRoutes) {
  Object.entries(routes).forEach(([path, middlewares]) =>
    router.use(path, ...middlewares),
  );

  return router;
}
