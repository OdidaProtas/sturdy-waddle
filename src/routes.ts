


import { CryptoRoutes } from "./controller/Controller";
import { CustomersRoutes } from "./entity/Customers";
import { MpesaRoutes } from "./entity/Mpesa";
import { UserRoutes } from "./entity/User";


import registerRoutes from "./helpers/registerRoutes";


export const Routes = registerRoutes(
  [
    UserRoutes, MpesaRoutes, CryptoRoutes, CustomersRoutes
  ]
)
