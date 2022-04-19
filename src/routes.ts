


import { MpesaRoutes } from "./entity/Mpesa";
import { UserRoutes } from "./entity/User";


import registerRoutes from "./helpers/registerRoutes";


export const Routes = registerRoutes(
  [
      UserRoutes, MpesaRoutes
  ]
)
