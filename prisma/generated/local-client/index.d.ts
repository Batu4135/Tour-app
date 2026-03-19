
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ProductAlias
 * 
 */
export type ProductAlias = $Result.DefaultSelection<Prisma.$ProductAliasPayload>
/**
 * Model CustomerPrice
 * 
 */
export type CustomerPrice = $Result.DefaultSelection<Prisma.$CustomerPricePayload>
/**
 * Model Draft
 * 
 */
export type Draft = $Result.DefaultSelection<Prisma.$DraftPayload>
/**
 * Model DraftLine
 * 
 */
export type DraftLine = $Result.DefaultSelection<Prisma.$DraftLinePayload>
/**
 * Model InvoiceRevision
 * 
 */
export type InvoiceRevision = $Result.DefaultSelection<Prisma.$InvoiceRevisionPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs>;

  /**
   * `prisma.productAlias`: Exposes CRUD operations for the **ProductAlias** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductAliases
    * const productAliases = await prisma.productAlias.findMany()
    * ```
    */
  get productAlias(): Prisma.ProductAliasDelegate<ExtArgs>;

  /**
   * `prisma.customerPrice`: Exposes CRUD operations for the **CustomerPrice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerPrices
    * const customerPrices = await prisma.customerPrice.findMany()
    * ```
    */
  get customerPrice(): Prisma.CustomerPriceDelegate<ExtArgs>;

  /**
   * `prisma.draft`: Exposes CRUD operations for the **Draft** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Drafts
    * const drafts = await prisma.draft.findMany()
    * ```
    */
  get draft(): Prisma.DraftDelegate<ExtArgs>;

  /**
   * `prisma.draftLine`: Exposes CRUD operations for the **DraftLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DraftLines
    * const draftLines = await prisma.draftLine.findMany()
    * ```
    */
  get draftLine(): Prisma.DraftLineDelegate<ExtArgs>;

  /**
   * `prisma.invoiceRevision`: Exposes CRUD operations for the **InvoiceRevision** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceRevisions
    * const invoiceRevisions = await prisma.invoiceRevision.findMany()
    * ```
    */
  get invoiceRevision(): Prisma.InvoiceRevisionDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Customer: 'Customer',
    Product: 'Product',
    ProductAlias: 'ProductAlias',
    CustomerPrice: 'CustomerPrice',
    Draft: 'Draft',
    DraftLine: 'DraftLine',
    InvoiceRevision: 'InvoiceRevision'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "customer" | "product" | "productAlias" | "customerPrice" | "draft" | "draftLine" | "invoiceRevision"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ProductAlias: {
        payload: Prisma.$ProductAliasPayload<ExtArgs>
        fields: Prisma.ProductAliasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductAliasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductAliasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>
          }
          findFirst: {
            args: Prisma.ProductAliasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductAliasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>
          }
          findMany: {
            args: Prisma.ProductAliasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>[]
          }
          create: {
            args: Prisma.ProductAliasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>
          }
          createMany: {
            args: Prisma.ProductAliasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductAliasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>[]
          }
          delete: {
            args: Prisma.ProductAliasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>
          }
          update: {
            args: Prisma.ProductAliasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>
          }
          deleteMany: {
            args: Prisma.ProductAliasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductAliasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProductAliasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductAliasPayload>
          }
          aggregate: {
            args: Prisma.ProductAliasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductAlias>
          }
          groupBy: {
            args: Prisma.ProductAliasGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductAliasGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductAliasCountArgs<ExtArgs>
            result: $Utils.Optional<ProductAliasCountAggregateOutputType> | number
          }
        }
      }
      CustomerPrice: {
        payload: Prisma.$CustomerPricePayload<ExtArgs>
        fields: Prisma.CustomerPriceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerPriceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerPriceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>
          }
          findFirst: {
            args: Prisma.CustomerPriceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerPriceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>
          }
          findMany: {
            args: Prisma.CustomerPriceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>[]
          }
          create: {
            args: Prisma.CustomerPriceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>
          }
          createMany: {
            args: Prisma.CustomerPriceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerPriceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>[]
          }
          delete: {
            args: Prisma.CustomerPriceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>
          }
          update: {
            args: Prisma.CustomerPriceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>
          }
          deleteMany: {
            args: Prisma.CustomerPriceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerPriceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerPriceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPricePayload>
          }
          aggregate: {
            args: Prisma.CustomerPriceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerPrice>
          }
          groupBy: {
            args: Prisma.CustomerPriceGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerPriceGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerPriceCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerPriceCountAggregateOutputType> | number
          }
        }
      }
      Draft: {
        payload: Prisma.$DraftPayload<ExtArgs>
        fields: Prisma.DraftFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DraftFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DraftFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>
          }
          findFirst: {
            args: Prisma.DraftFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DraftFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>
          }
          findMany: {
            args: Prisma.DraftFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>[]
          }
          create: {
            args: Prisma.DraftCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>
          }
          createMany: {
            args: Prisma.DraftCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DraftCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>[]
          }
          delete: {
            args: Prisma.DraftDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>
          }
          update: {
            args: Prisma.DraftUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>
          }
          deleteMany: {
            args: Prisma.DraftDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DraftUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DraftUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftPayload>
          }
          aggregate: {
            args: Prisma.DraftAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDraft>
          }
          groupBy: {
            args: Prisma.DraftGroupByArgs<ExtArgs>
            result: $Utils.Optional<DraftGroupByOutputType>[]
          }
          count: {
            args: Prisma.DraftCountArgs<ExtArgs>
            result: $Utils.Optional<DraftCountAggregateOutputType> | number
          }
        }
      }
      DraftLine: {
        payload: Prisma.$DraftLinePayload<ExtArgs>
        fields: Prisma.DraftLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DraftLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DraftLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>
          }
          findFirst: {
            args: Prisma.DraftLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DraftLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>
          }
          findMany: {
            args: Prisma.DraftLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>[]
          }
          create: {
            args: Prisma.DraftLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>
          }
          createMany: {
            args: Prisma.DraftLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DraftLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>[]
          }
          delete: {
            args: Prisma.DraftLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>
          }
          update: {
            args: Prisma.DraftLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>
          }
          deleteMany: {
            args: Prisma.DraftLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DraftLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DraftLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DraftLinePayload>
          }
          aggregate: {
            args: Prisma.DraftLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDraftLine>
          }
          groupBy: {
            args: Prisma.DraftLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<DraftLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.DraftLineCountArgs<ExtArgs>
            result: $Utils.Optional<DraftLineCountAggregateOutputType> | number
          }
        }
      }
      InvoiceRevision: {
        payload: Prisma.$InvoiceRevisionPayload<ExtArgs>
        fields: Prisma.InvoiceRevisionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceRevisionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceRevisionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>
          }
          findFirst: {
            args: Prisma.InvoiceRevisionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceRevisionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>
          }
          findMany: {
            args: Prisma.InvoiceRevisionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>[]
          }
          create: {
            args: Prisma.InvoiceRevisionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>
          }
          createMany: {
            args: Prisma.InvoiceRevisionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceRevisionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>[]
          }
          delete: {
            args: Prisma.InvoiceRevisionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>
          }
          update: {
            args: Prisma.InvoiceRevisionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>
          }
          deleteMany: {
            args: Prisma.InvoiceRevisionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceRevisionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceRevisionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceRevisionPayload>
          }
          aggregate: {
            args: Prisma.InvoiceRevisionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceRevision>
          }
          groupBy: {
            args: Prisma.InvoiceRevisionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceRevisionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceRevisionCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceRevisionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    invoiceRevisions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceRevisions?: boolean | UserCountOutputTypeCountInvoiceRevisionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInvoiceRevisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceRevisionWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    customerPrice: number
    drafts: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customerPrice?: boolean | CustomerCountOutputTypeCountCustomerPriceArgs
    drafts?: boolean | CustomerCountOutputTypeCountDraftsArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountCustomerPriceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerPriceWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountDraftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DraftWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    aliases: number
    customerPrice: number
    draftLines: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    aliases?: boolean | ProductCountOutputTypeCountAliasesArgs
    customerPrice?: boolean | ProductCountOutputTypeCountCustomerPriceArgs
    draftLines?: boolean | ProductCountOutputTypeCountDraftLinesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountAliasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductAliasWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountCustomerPriceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerPriceWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountDraftLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DraftLineWhereInput
  }


  /**
   * Count Type DraftCountOutputType
   */

  export type DraftCountOutputType = {
    lines: number
    revisions: number
  }

  export type DraftCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lines?: boolean | DraftCountOutputTypeCountLinesArgs
    revisions?: boolean | DraftCountOutputTypeCountRevisionsArgs
  }

  // Custom InputTypes
  /**
   * DraftCountOutputType without action
   */
  export type DraftCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftCountOutputType
     */
    select?: DraftCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DraftCountOutputType without action
   */
  export type DraftCountOutputTypeCountLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DraftLineWhereInput
  }

  /**
   * DraftCountOutputType without action
   */
  export type DraftCountOutputTypeCountRevisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceRevisionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    pinHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    pinHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    pinHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    pinHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    pinHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    pinHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    pinHash: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pinHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoiceRevisions?: boolean | User$invoiceRevisionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pinHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    pinHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceRevisions?: boolean | User$invoiceRevisionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      invoiceRevisions: Prisma.$InvoiceRevisionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      pinHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoiceRevisions<T extends User$invoiceRevisionsArgs<ExtArgs> = {}>(args?: Subset<T, User$invoiceRevisionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly pinHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.invoiceRevisions
   */
  export type User$invoiceRevisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    where?: InvoiceRevisionWhereInput
    orderBy?: InvoiceRevisionOrderByWithRelationInput | InvoiceRevisionOrderByWithRelationInput[]
    cursor?: InvoiceRevisionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceRevisionScalarFieldEnum | InvoiceRevisionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    id: number | null
  }

  export type CustomerSumAggregateOutputType = {
    id: number | null
  }

  export type CustomerMinAggregateOutputType = {
    id: number | null
    name: string | null
    address: string | null
    phone: string | null
    routeDay: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: number | null
    name: string | null
    address: string | null
    phone: string | null
    routeDay: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    address: number
    phone: number
    routeDay: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    id?: true
  }

  export type CustomerSumAggregateInputType = {
    id?: true
  }

  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    phone?: true
    routeDay?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    phone?: true
    routeDay?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    phone?: true
    routeDay?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: number
    name: string
    address: string | null
    phone: string | null
    routeDay: string | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    phone?: boolean
    routeDay?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customerPrice?: boolean | Customer$customerPriceArgs<ExtArgs>
    drafts?: boolean | Customer$draftsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    phone?: boolean
    routeDay?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    phone?: boolean
    routeDay?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customerPrice?: boolean | Customer$customerPriceArgs<ExtArgs>
    drafts?: boolean | Customer$draftsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      customerPrice: Prisma.$CustomerPricePayload<ExtArgs>[]
      drafts: Prisma.$DraftPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      address: string | null
      phone: string | null
      routeDay: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customerPrice<T extends Customer$customerPriceArgs<ExtArgs> = {}>(args?: Subset<T, Customer$customerPriceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "findMany"> | Null>
    drafts<T extends Customer$draftsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$draftsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */ 
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'Int'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly routeDay: FieldRef<"Customer", 'String'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer.customerPrice
   */
  export type Customer$customerPriceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    where?: CustomerPriceWhereInput
    orderBy?: CustomerPriceOrderByWithRelationInput | CustomerPriceOrderByWithRelationInput[]
    cursor?: CustomerPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerPriceScalarFieldEnum | CustomerPriceScalarFieldEnum[]
  }

  /**
   * Customer.drafts
   */
  export type Customer$draftsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    where?: DraftWhereInput
    orderBy?: DraftOrderByWithRelationInput | DraftOrderByWithRelationInput[]
    cursor?: DraftWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DraftScalarFieldEnum | DraftScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    defaultPriceCents: number | null
    licenseFeeCents: number | null
    licenseWeightGrams: number | null
  }

  export type ProductSumAggregateOutputType = {
    id: number | null
    defaultPriceCents: number | null
    licenseFeeCents: number | null
    licenseWeightGrams: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: number | null
    sku: string | null
    name: string | null
    defaultPriceCents: number | null
    licenseFeeCents: number | null
    licenseMaterial: string | null
    licenseWeightGrams: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductMaxAggregateOutputType = {
    id: number | null
    sku: string | null
    name: string | null
    defaultPriceCents: number | null
    licenseFeeCents: number | null
    licenseMaterial: string | null
    licenseWeightGrams: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    sku: number
    name: number
    defaultPriceCents: number
    licenseFeeCents: number
    licenseMaterial: number
    licenseWeightGrams: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    defaultPriceCents?: true
    licenseFeeCents?: true
    licenseWeightGrams?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    defaultPriceCents?: true
    licenseFeeCents?: true
    licenseWeightGrams?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    sku?: true
    name?: true
    defaultPriceCents?: true
    licenseFeeCents?: true
    licenseMaterial?: true
    licenseWeightGrams?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    sku?: true
    name?: true
    defaultPriceCents?: true
    licenseFeeCents?: true
    licenseMaterial?: true
    licenseWeightGrams?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    sku?: true
    name?: true
    defaultPriceCents?: true
    licenseFeeCents?: true
    licenseMaterial?: true
    licenseWeightGrams?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: number
    sku: string
    name: string
    defaultPriceCents: number | null
    licenseFeeCents: number
    licenseMaterial: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sku?: boolean
    name?: boolean
    defaultPriceCents?: boolean
    licenseFeeCents?: boolean
    licenseMaterial?: boolean
    licenseWeightGrams?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    aliases?: boolean | Product$aliasesArgs<ExtArgs>
    customerPrice?: boolean | Product$customerPriceArgs<ExtArgs>
    draftLines?: boolean | Product$draftLinesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sku?: boolean
    name?: boolean
    defaultPriceCents?: boolean
    licenseFeeCents?: boolean
    licenseMaterial?: boolean
    licenseWeightGrams?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    sku?: boolean
    name?: boolean
    defaultPriceCents?: boolean
    licenseFeeCents?: boolean
    licenseMaterial?: boolean
    licenseWeightGrams?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    aliases?: boolean | Product$aliasesArgs<ExtArgs>
    customerPrice?: boolean | Product$customerPriceArgs<ExtArgs>
    draftLines?: boolean | Product$draftLinesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      aliases: Prisma.$ProductAliasPayload<ExtArgs>[]
      customerPrice: Prisma.$CustomerPricePayload<ExtArgs>[]
      draftLines: Prisma.$DraftLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      sku: string
      name: string
      defaultPriceCents: number | null
      licenseFeeCents: number
      licenseMaterial: string | null
      licenseWeightGrams: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    aliases<T extends Product$aliasesArgs<ExtArgs> = {}>(args?: Subset<T, Product$aliasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findMany"> | Null>
    customerPrice<T extends Product$customerPriceArgs<ExtArgs> = {}>(args?: Subset<T, Product$customerPriceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "findMany"> | Null>
    draftLines<T extends Product$draftLinesArgs<ExtArgs> = {}>(args?: Subset<T, Product$draftLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */ 
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'Int'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly defaultPriceCents: FieldRef<"Product", 'Int'>
    readonly licenseFeeCents: FieldRef<"Product", 'Int'>
    readonly licenseMaterial: FieldRef<"Product", 'String'>
    readonly licenseWeightGrams: FieldRef<"Product", 'Int'>
    readonly isActive: FieldRef<"Product", 'Boolean'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
  }

  /**
   * Product.aliases
   */
  export type Product$aliasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    where?: ProductAliasWhereInput
    orderBy?: ProductAliasOrderByWithRelationInput | ProductAliasOrderByWithRelationInput[]
    cursor?: ProductAliasWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductAliasScalarFieldEnum | ProductAliasScalarFieldEnum[]
  }

  /**
   * Product.customerPrice
   */
  export type Product$customerPriceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    where?: CustomerPriceWhereInput
    orderBy?: CustomerPriceOrderByWithRelationInput | CustomerPriceOrderByWithRelationInput[]
    cursor?: CustomerPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerPriceScalarFieldEnum | CustomerPriceScalarFieldEnum[]
  }

  /**
   * Product.draftLines
   */
  export type Product$draftLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    where?: DraftLineWhereInput
    orderBy?: DraftLineOrderByWithRelationInput | DraftLineOrderByWithRelationInput[]
    cursor?: DraftLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DraftLineScalarFieldEnum | DraftLineScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ProductAlias
   */

  export type AggregateProductAlias = {
    _count: ProductAliasCountAggregateOutputType | null
    _avg: ProductAliasAvgAggregateOutputType | null
    _sum: ProductAliasSumAggregateOutputType | null
    _min: ProductAliasMinAggregateOutputType | null
    _max: ProductAliasMaxAggregateOutputType | null
  }

  export type ProductAliasAvgAggregateOutputType = {
    id: number | null
    productId: number | null
  }

  export type ProductAliasSumAggregateOutputType = {
    id: number | null
    productId: number | null
  }

  export type ProductAliasMinAggregateOutputType = {
    id: number | null
    productId: number | null
    alias: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductAliasMaxAggregateOutputType = {
    id: number | null
    productId: number | null
    alias: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProductAliasCountAggregateOutputType = {
    id: number
    productId: number
    alias: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProductAliasAvgAggregateInputType = {
    id?: true
    productId?: true
  }

  export type ProductAliasSumAggregateInputType = {
    id?: true
    productId?: true
  }

  export type ProductAliasMinAggregateInputType = {
    id?: true
    productId?: true
    alias?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductAliasMaxAggregateInputType = {
    id?: true
    productId?: true
    alias?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProductAliasCountAggregateInputType = {
    id?: true
    productId?: true
    alias?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProductAliasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductAlias to aggregate.
     */
    where?: ProductAliasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAliases to fetch.
     */
    orderBy?: ProductAliasOrderByWithRelationInput | ProductAliasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductAliasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAliases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAliases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductAliases
    **/
    _count?: true | ProductAliasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAliasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductAliasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductAliasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductAliasMaxAggregateInputType
  }

  export type GetProductAliasAggregateType<T extends ProductAliasAggregateArgs> = {
        [P in keyof T & keyof AggregateProductAlias]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductAlias[P]>
      : GetScalarType<T[P], AggregateProductAlias[P]>
  }




  export type ProductAliasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductAliasWhereInput
    orderBy?: ProductAliasOrderByWithAggregationInput | ProductAliasOrderByWithAggregationInput[]
    by: ProductAliasScalarFieldEnum[] | ProductAliasScalarFieldEnum
    having?: ProductAliasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductAliasCountAggregateInputType | true
    _avg?: ProductAliasAvgAggregateInputType
    _sum?: ProductAliasSumAggregateInputType
    _min?: ProductAliasMinAggregateInputType
    _max?: ProductAliasMaxAggregateInputType
  }

  export type ProductAliasGroupByOutputType = {
    id: number
    productId: number
    alias: string
    createdAt: Date
    updatedAt: Date
    _count: ProductAliasCountAggregateOutputType | null
    _avg: ProductAliasAvgAggregateOutputType | null
    _sum: ProductAliasSumAggregateOutputType | null
    _min: ProductAliasMinAggregateOutputType | null
    _max: ProductAliasMaxAggregateOutputType | null
  }

  type GetProductAliasGroupByPayload<T extends ProductAliasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductAliasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductAliasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductAliasGroupByOutputType[P]>
            : GetScalarType<T[P], ProductAliasGroupByOutputType[P]>
        }
      >
    >


  export type ProductAliasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    alias?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productAlias"]>

  export type ProductAliasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    alias?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productAlias"]>

  export type ProductAliasSelectScalar = {
    id?: boolean
    productId?: boolean
    alias?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProductAliasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductAliasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductAliasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductAlias"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      productId: number
      alias: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["productAlias"]>
    composites: {}
  }

  type ProductAliasGetPayload<S extends boolean | null | undefined | ProductAliasDefaultArgs> = $Result.GetResult<Prisma.$ProductAliasPayload, S>

  type ProductAliasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProductAliasFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProductAliasCountAggregateInputType | true
    }

  export interface ProductAliasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductAlias'], meta: { name: 'ProductAlias' } }
    /**
     * Find zero or one ProductAlias that matches the filter.
     * @param {ProductAliasFindUniqueArgs} args - Arguments to find a ProductAlias
     * @example
     * // Get one ProductAlias
     * const productAlias = await prisma.productAlias.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductAliasFindUniqueArgs>(args: SelectSubset<T, ProductAliasFindUniqueArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProductAlias that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProductAliasFindUniqueOrThrowArgs} args - Arguments to find a ProductAlias
     * @example
     * // Get one ProductAlias
     * const productAlias = await prisma.productAlias.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductAliasFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductAliasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProductAlias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAliasFindFirstArgs} args - Arguments to find a ProductAlias
     * @example
     * // Get one ProductAlias
     * const productAlias = await prisma.productAlias.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductAliasFindFirstArgs>(args?: SelectSubset<T, ProductAliasFindFirstArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProductAlias that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAliasFindFirstOrThrowArgs} args - Arguments to find a ProductAlias
     * @example
     * // Get one ProductAlias
     * const productAlias = await prisma.productAlias.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductAliasFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductAliasFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProductAliases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAliasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductAliases
     * const productAliases = await prisma.productAlias.findMany()
     * 
     * // Get first 10 ProductAliases
     * const productAliases = await prisma.productAlias.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productAliasWithIdOnly = await prisma.productAlias.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductAliasFindManyArgs>(args?: SelectSubset<T, ProductAliasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProductAlias.
     * @param {ProductAliasCreateArgs} args - Arguments to create a ProductAlias.
     * @example
     * // Create one ProductAlias
     * const ProductAlias = await prisma.productAlias.create({
     *   data: {
     *     // ... data to create a ProductAlias
     *   }
     * })
     * 
     */
    create<T extends ProductAliasCreateArgs>(args: SelectSubset<T, ProductAliasCreateArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProductAliases.
     * @param {ProductAliasCreateManyArgs} args - Arguments to create many ProductAliases.
     * @example
     * // Create many ProductAliases
     * const productAlias = await prisma.productAlias.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductAliasCreateManyArgs>(args?: SelectSubset<T, ProductAliasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductAliases and returns the data saved in the database.
     * @param {ProductAliasCreateManyAndReturnArgs} args - Arguments to create many ProductAliases.
     * @example
     * // Create many ProductAliases
     * const productAlias = await prisma.productAlias.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductAliases and only return the `id`
     * const productAliasWithIdOnly = await prisma.productAlias.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductAliasCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductAliasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProductAlias.
     * @param {ProductAliasDeleteArgs} args - Arguments to delete one ProductAlias.
     * @example
     * // Delete one ProductAlias
     * const ProductAlias = await prisma.productAlias.delete({
     *   where: {
     *     // ... filter to delete one ProductAlias
     *   }
     * })
     * 
     */
    delete<T extends ProductAliasDeleteArgs>(args: SelectSubset<T, ProductAliasDeleteArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProductAlias.
     * @param {ProductAliasUpdateArgs} args - Arguments to update one ProductAlias.
     * @example
     * // Update one ProductAlias
     * const productAlias = await prisma.productAlias.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductAliasUpdateArgs>(args: SelectSubset<T, ProductAliasUpdateArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProductAliases.
     * @param {ProductAliasDeleteManyArgs} args - Arguments to filter ProductAliases to delete.
     * @example
     * // Delete a few ProductAliases
     * const { count } = await prisma.productAlias.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductAliasDeleteManyArgs>(args?: SelectSubset<T, ProductAliasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductAliases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAliasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductAliases
     * const productAlias = await prisma.productAlias.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductAliasUpdateManyArgs>(args: SelectSubset<T, ProductAliasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProductAlias.
     * @param {ProductAliasUpsertArgs} args - Arguments to update or create a ProductAlias.
     * @example
     * // Update or create a ProductAlias
     * const productAlias = await prisma.productAlias.upsert({
     *   create: {
     *     // ... data to create a ProductAlias
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductAlias we want to update
     *   }
     * })
     */
    upsert<T extends ProductAliasUpsertArgs>(args: SelectSubset<T, ProductAliasUpsertArgs<ExtArgs>>): Prisma__ProductAliasClient<$Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProductAliases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAliasCountArgs} args - Arguments to filter ProductAliases to count.
     * @example
     * // Count the number of ProductAliases
     * const count = await prisma.productAlias.count({
     *   where: {
     *     // ... the filter for the ProductAliases we want to count
     *   }
     * })
    **/
    count<T extends ProductAliasCountArgs>(
      args?: Subset<T, ProductAliasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductAliasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductAlias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAliasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAliasAggregateArgs>(args: Subset<T, ProductAliasAggregateArgs>): Prisma.PrismaPromise<GetProductAliasAggregateType<T>>

    /**
     * Group by ProductAlias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAliasGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductAliasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductAliasGroupByArgs['orderBy'] }
        : { orderBy?: ProductAliasGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductAliasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductAliasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductAlias model
   */
  readonly fields: ProductAliasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductAlias.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductAliasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductAlias model
   */ 
  interface ProductAliasFieldRefs {
    readonly id: FieldRef<"ProductAlias", 'Int'>
    readonly productId: FieldRef<"ProductAlias", 'Int'>
    readonly alias: FieldRef<"ProductAlias", 'String'>
    readonly createdAt: FieldRef<"ProductAlias", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductAlias", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductAlias findUnique
   */
  export type ProductAliasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * Filter, which ProductAlias to fetch.
     */
    where: ProductAliasWhereUniqueInput
  }

  /**
   * ProductAlias findUniqueOrThrow
   */
  export type ProductAliasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * Filter, which ProductAlias to fetch.
     */
    where: ProductAliasWhereUniqueInput
  }

  /**
   * ProductAlias findFirst
   */
  export type ProductAliasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * Filter, which ProductAlias to fetch.
     */
    where?: ProductAliasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAliases to fetch.
     */
    orderBy?: ProductAliasOrderByWithRelationInput | ProductAliasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductAliases.
     */
    cursor?: ProductAliasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAliases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAliases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductAliases.
     */
    distinct?: ProductAliasScalarFieldEnum | ProductAliasScalarFieldEnum[]
  }

  /**
   * ProductAlias findFirstOrThrow
   */
  export type ProductAliasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * Filter, which ProductAlias to fetch.
     */
    where?: ProductAliasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAliases to fetch.
     */
    orderBy?: ProductAliasOrderByWithRelationInput | ProductAliasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductAliases.
     */
    cursor?: ProductAliasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAliases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAliases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductAliases.
     */
    distinct?: ProductAliasScalarFieldEnum | ProductAliasScalarFieldEnum[]
  }

  /**
   * ProductAlias findMany
   */
  export type ProductAliasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * Filter, which ProductAliases to fetch.
     */
    where?: ProductAliasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductAliases to fetch.
     */
    orderBy?: ProductAliasOrderByWithRelationInput | ProductAliasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductAliases.
     */
    cursor?: ProductAliasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductAliases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductAliases.
     */
    skip?: number
    distinct?: ProductAliasScalarFieldEnum | ProductAliasScalarFieldEnum[]
  }

  /**
   * ProductAlias create
   */
  export type ProductAliasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductAlias.
     */
    data: XOR<ProductAliasCreateInput, ProductAliasUncheckedCreateInput>
  }

  /**
   * ProductAlias createMany
   */
  export type ProductAliasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductAliases.
     */
    data: ProductAliasCreateManyInput | ProductAliasCreateManyInput[]
  }

  /**
   * ProductAlias createManyAndReturn
   */
  export type ProductAliasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProductAliases.
     */
    data: ProductAliasCreateManyInput | ProductAliasCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductAlias update
   */
  export type ProductAliasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductAlias.
     */
    data: XOR<ProductAliasUpdateInput, ProductAliasUncheckedUpdateInput>
    /**
     * Choose, which ProductAlias to update.
     */
    where: ProductAliasWhereUniqueInput
  }

  /**
   * ProductAlias updateMany
   */
  export type ProductAliasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductAliases.
     */
    data: XOR<ProductAliasUpdateManyMutationInput, ProductAliasUncheckedUpdateManyInput>
    /**
     * Filter which ProductAliases to update
     */
    where?: ProductAliasWhereInput
  }

  /**
   * ProductAlias upsert
   */
  export type ProductAliasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductAlias to update in case it exists.
     */
    where: ProductAliasWhereUniqueInput
    /**
     * In case the ProductAlias found by the `where` argument doesn't exist, create a new ProductAlias with this data.
     */
    create: XOR<ProductAliasCreateInput, ProductAliasUncheckedCreateInput>
    /**
     * In case the ProductAlias was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductAliasUpdateInput, ProductAliasUncheckedUpdateInput>
  }

  /**
   * ProductAlias delete
   */
  export type ProductAliasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
    /**
     * Filter which ProductAlias to delete.
     */
    where: ProductAliasWhereUniqueInput
  }

  /**
   * ProductAlias deleteMany
   */
  export type ProductAliasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductAliases to delete
     */
    where?: ProductAliasWhereInput
  }

  /**
   * ProductAlias without action
   */
  export type ProductAliasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductAlias
     */
    select?: ProductAliasSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductAliasInclude<ExtArgs> | null
  }


  /**
   * Model CustomerPrice
   */

  export type AggregateCustomerPrice = {
    _count: CustomerPriceCountAggregateOutputType | null
    _avg: CustomerPriceAvgAggregateOutputType | null
    _sum: CustomerPriceSumAggregateOutputType | null
    _min: CustomerPriceMinAggregateOutputType | null
    _max: CustomerPriceMaxAggregateOutputType | null
  }

  export type CustomerPriceAvgAggregateOutputType = {
    id: number | null
    customerId: number | null
    productId: number | null
    priceCents: number | null
  }

  export type CustomerPriceSumAggregateOutputType = {
    id: number | null
    customerId: number | null
    productId: number | null
    priceCents: number | null
  }

  export type CustomerPriceMinAggregateOutputType = {
    id: number | null
    customerId: number | null
    productId: number | null
    priceCents: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerPriceMaxAggregateOutputType = {
    id: number | null
    customerId: number | null
    productId: number | null
    priceCents: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerPriceCountAggregateOutputType = {
    id: number
    customerId: number
    productId: number
    priceCents: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerPriceAvgAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    priceCents?: true
  }

  export type CustomerPriceSumAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    priceCents?: true
  }

  export type CustomerPriceMinAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    priceCents?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerPriceMaxAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    priceCents?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerPriceCountAggregateInputType = {
    id?: true
    customerId?: true
    productId?: true
    priceCents?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerPriceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerPrice to aggregate.
     */
    where?: CustomerPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPrices to fetch.
     */
    orderBy?: CustomerPriceOrderByWithRelationInput | CustomerPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerPrices
    **/
    _count?: true | CustomerPriceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerPriceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerPriceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerPriceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerPriceMaxAggregateInputType
  }

  export type GetCustomerPriceAggregateType<T extends CustomerPriceAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerPrice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerPrice[P]>
      : GetScalarType<T[P], AggregateCustomerPrice[P]>
  }




  export type CustomerPriceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerPriceWhereInput
    orderBy?: CustomerPriceOrderByWithAggregationInput | CustomerPriceOrderByWithAggregationInput[]
    by: CustomerPriceScalarFieldEnum[] | CustomerPriceScalarFieldEnum
    having?: CustomerPriceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerPriceCountAggregateInputType | true
    _avg?: CustomerPriceAvgAggregateInputType
    _sum?: CustomerPriceSumAggregateInputType
    _min?: CustomerPriceMinAggregateInputType
    _max?: CustomerPriceMaxAggregateInputType
  }

  export type CustomerPriceGroupByOutputType = {
    id: number
    customerId: number
    productId: number
    priceCents: number
    createdAt: Date
    updatedAt: Date
    _count: CustomerPriceCountAggregateOutputType | null
    _avg: CustomerPriceAvgAggregateOutputType | null
    _sum: CustomerPriceSumAggregateOutputType | null
    _min: CustomerPriceMinAggregateOutputType | null
    _max: CustomerPriceMaxAggregateOutputType | null
  }

  type GetCustomerPriceGroupByPayload<T extends CustomerPriceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerPriceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerPriceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerPriceGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerPriceGroupByOutputType[P]>
        }
      >
    >


  export type CustomerPriceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    productId?: boolean
    priceCents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerPrice"]>

  export type CustomerPriceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    productId?: boolean
    priceCents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerPrice"]>

  export type CustomerPriceSelectScalar = {
    id?: boolean
    customerId?: boolean
    productId?: boolean
    priceCents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerPriceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type CustomerPriceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $CustomerPricePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerPrice"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      customerId: number
      productId: number
      priceCents: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customerPrice"]>
    composites: {}
  }

  type CustomerPriceGetPayload<S extends boolean | null | undefined | CustomerPriceDefaultArgs> = $Result.GetResult<Prisma.$CustomerPricePayload, S>

  type CustomerPriceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerPriceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerPriceCountAggregateInputType | true
    }

  export interface CustomerPriceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerPrice'], meta: { name: 'CustomerPrice' } }
    /**
     * Find zero or one CustomerPrice that matches the filter.
     * @param {CustomerPriceFindUniqueArgs} args - Arguments to find a CustomerPrice
     * @example
     * // Get one CustomerPrice
     * const customerPrice = await prisma.customerPrice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerPriceFindUniqueArgs>(args: SelectSubset<T, CustomerPriceFindUniqueArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CustomerPrice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerPriceFindUniqueOrThrowArgs} args - Arguments to find a CustomerPrice
     * @example
     * // Get one CustomerPrice
     * const customerPrice = await prisma.customerPrice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerPriceFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CustomerPrice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPriceFindFirstArgs} args - Arguments to find a CustomerPrice
     * @example
     * // Get one CustomerPrice
     * const customerPrice = await prisma.customerPrice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerPriceFindFirstArgs>(args?: SelectSubset<T, CustomerPriceFindFirstArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CustomerPrice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPriceFindFirstOrThrowArgs} args - Arguments to find a CustomerPrice
     * @example
     * // Get one CustomerPrice
     * const customerPrice = await prisma.customerPrice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerPriceFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CustomerPrices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPriceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerPrices
     * const customerPrices = await prisma.customerPrice.findMany()
     * 
     * // Get first 10 CustomerPrices
     * const customerPrices = await prisma.customerPrice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerPriceWithIdOnly = await prisma.customerPrice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerPriceFindManyArgs>(args?: SelectSubset<T, CustomerPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CustomerPrice.
     * @param {CustomerPriceCreateArgs} args - Arguments to create a CustomerPrice.
     * @example
     * // Create one CustomerPrice
     * const CustomerPrice = await prisma.customerPrice.create({
     *   data: {
     *     // ... data to create a CustomerPrice
     *   }
     * })
     * 
     */
    create<T extends CustomerPriceCreateArgs>(args: SelectSubset<T, CustomerPriceCreateArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CustomerPrices.
     * @param {CustomerPriceCreateManyArgs} args - Arguments to create many CustomerPrices.
     * @example
     * // Create many CustomerPrices
     * const customerPrice = await prisma.customerPrice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerPriceCreateManyArgs>(args?: SelectSubset<T, CustomerPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomerPrices and returns the data saved in the database.
     * @param {CustomerPriceCreateManyAndReturnArgs} args - Arguments to create many CustomerPrices.
     * @example
     * // Create many CustomerPrices
     * const customerPrice = await prisma.customerPrice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomerPrices and only return the `id`
     * const customerPriceWithIdOnly = await prisma.customerPrice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerPriceCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerPriceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CustomerPrice.
     * @param {CustomerPriceDeleteArgs} args - Arguments to delete one CustomerPrice.
     * @example
     * // Delete one CustomerPrice
     * const CustomerPrice = await prisma.customerPrice.delete({
     *   where: {
     *     // ... filter to delete one CustomerPrice
     *   }
     * })
     * 
     */
    delete<T extends CustomerPriceDeleteArgs>(args: SelectSubset<T, CustomerPriceDeleteArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CustomerPrice.
     * @param {CustomerPriceUpdateArgs} args - Arguments to update one CustomerPrice.
     * @example
     * // Update one CustomerPrice
     * const customerPrice = await prisma.customerPrice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerPriceUpdateArgs>(args: SelectSubset<T, CustomerPriceUpdateArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CustomerPrices.
     * @param {CustomerPriceDeleteManyArgs} args - Arguments to filter CustomerPrices to delete.
     * @example
     * // Delete a few CustomerPrices
     * const { count } = await prisma.customerPrice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerPriceDeleteManyArgs>(args?: SelectSubset<T, CustomerPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPriceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerPrices
     * const customerPrice = await prisma.customerPrice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerPriceUpdateManyArgs>(args: SelectSubset<T, CustomerPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CustomerPrice.
     * @param {CustomerPriceUpsertArgs} args - Arguments to update or create a CustomerPrice.
     * @example
     * // Update or create a CustomerPrice
     * const customerPrice = await prisma.customerPrice.upsert({
     *   create: {
     *     // ... data to create a CustomerPrice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerPrice we want to update
     *   }
     * })
     */
    upsert<T extends CustomerPriceUpsertArgs>(args: SelectSubset<T, CustomerPriceUpsertArgs<ExtArgs>>): Prisma__CustomerPriceClient<$Result.GetResult<Prisma.$CustomerPricePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CustomerPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPriceCountArgs} args - Arguments to filter CustomerPrices to count.
     * @example
     * // Count the number of CustomerPrices
     * const count = await prisma.customerPrice.count({
     *   where: {
     *     // ... the filter for the CustomerPrices we want to count
     *   }
     * })
    **/
    count<T extends CustomerPriceCountArgs>(
      args?: Subset<T, CustomerPriceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerPriceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPriceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerPriceAggregateArgs>(args: Subset<T, CustomerPriceAggregateArgs>): Prisma.PrismaPromise<GetCustomerPriceAggregateType<T>>

    /**
     * Group by CustomerPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPriceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerPriceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerPriceGroupByArgs['orderBy'] }
        : { orderBy?: CustomerPriceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerPrice model
   */
  readonly fields: CustomerPriceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerPrice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerPriceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CustomerPrice model
   */ 
  interface CustomerPriceFieldRefs {
    readonly id: FieldRef<"CustomerPrice", 'Int'>
    readonly customerId: FieldRef<"CustomerPrice", 'Int'>
    readonly productId: FieldRef<"CustomerPrice", 'Int'>
    readonly priceCents: FieldRef<"CustomerPrice", 'Int'>
    readonly createdAt: FieldRef<"CustomerPrice", 'DateTime'>
    readonly updatedAt: FieldRef<"CustomerPrice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerPrice findUnique
   */
  export type CustomerPriceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPrice to fetch.
     */
    where: CustomerPriceWhereUniqueInput
  }

  /**
   * CustomerPrice findUniqueOrThrow
   */
  export type CustomerPriceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPrice to fetch.
     */
    where: CustomerPriceWhereUniqueInput
  }

  /**
   * CustomerPrice findFirst
   */
  export type CustomerPriceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPrice to fetch.
     */
    where?: CustomerPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPrices to fetch.
     */
    orderBy?: CustomerPriceOrderByWithRelationInput | CustomerPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerPrices.
     */
    cursor?: CustomerPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerPrices.
     */
    distinct?: CustomerPriceScalarFieldEnum | CustomerPriceScalarFieldEnum[]
  }

  /**
   * CustomerPrice findFirstOrThrow
   */
  export type CustomerPriceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPrice to fetch.
     */
    where?: CustomerPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPrices to fetch.
     */
    orderBy?: CustomerPriceOrderByWithRelationInput | CustomerPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerPrices.
     */
    cursor?: CustomerPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerPrices.
     */
    distinct?: CustomerPriceScalarFieldEnum | CustomerPriceScalarFieldEnum[]
  }

  /**
   * CustomerPrice findMany
   */
  export type CustomerPriceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPrices to fetch.
     */
    where?: CustomerPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPrices to fetch.
     */
    orderBy?: CustomerPriceOrderByWithRelationInput | CustomerPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerPrices.
     */
    cursor?: CustomerPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPrices.
     */
    skip?: number
    distinct?: CustomerPriceScalarFieldEnum | CustomerPriceScalarFieldEnum[]
  }

  /**
   * CustomerPrice create
   */
  export type CustomerPriceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomerPrice.
     */
    data: XOR<CustomerPriceCreateInput, CustomerPriceUncheckedCreateInput>
  }

  /**
   * CustomerPrice createMany
   */
  export type CustomerPriceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerPrices.
     */
    data: CustomerPriceCreateManyInput | CustomerPriceCreateManyInput[]
  }

  /**
   * CustomerPrice createManyAndReturn
   */
  export type CustomerPriceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CustomerPrices.
     */
    data: CustomerPriceCreateManyInput | CustomerPriceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomerPrice update
   */
  export type CustomerPriceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomerPrice.
     */
    data: XOR<CustomerPriceUpdateInput, CustomerPriceUncheckedUpdateInput>
    /**
     * Choose, which CustomerPrice to update.
     */
    where: CustomerPriceWhereUniqueInput
  }

  /**
   * CustomerPrice updateMany
   */
  export type CustomerPriceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerPrices.
     */
    data: XOR<CustomerPriceUpdateManyMutationInput, CustomerPriceUncheckedUpdateManyInput>
    /**
     * Filter which CustomerPrices to update
     */
    where?: CustomerPriceWhereInput
  }

  /**
   * CustomerPrice upsert
   */
  export type CustomerPriceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomerPrice to update in case it exists.
     */
    where: CustomerPriceWhereUniqueInput
    /**
     * In case the CustomerPrice found by the `where` argument doesn't exist, create a new CustomerPrice with this data.
     */
    create: XOR<CustomerPriceCreateInput, CustomerPriceUncheckedCreateInput>
    /**
     * In case the CustomerPrice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerPriceUpdateInput, CustomerPriceUncheckedUpdateInput>
  }

  /**
   * CustomerPrice delete
   */
  export type CustomerPriceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
    /**
     * Filter which CustomerPrice to delete.
     */
    where: CustomerPriceWhereUniqueInput
  }

  /**
   * CustomerPrice deleteMany
   */
  export type CustomerPriceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerPrices to delete
     */
    where?: CustomerPriceWhereInput
  }

  /**
   * CustomerPrice without action
   */
  export type CustomerPriceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPrice
     */
    select?: CustomerPriceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPriceInclude<ExtArgs> | null
  }


  /**
   * Model Draft
   */

  export type AggregateDraft = {
    _count: DraftCountAggregateOutputType | null
    _avg: DraftAvgAggregateOutputType | null
    _sum: DraftSumAggregateOutputType | null
    _min: DraftMinAggregateOutputType | null
    _max: DraftMaxAggregateOutputType | null
  }

  export type DraftAvgAggregateOutputType = {
    id: number | null
    customerId: number | null
  }

  export type DraftSumAggregateOutputType = {
    id: number | null
    customerId: number | null
  }

  export type DraftMinAggregateOutputType = {
    id: number | null
    customerId: number | null
    date: Date | null
    note: string | null
    includeLicenseFee: boolean | null
    paymentMethod: string | null
    tourClosedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DraftMaxAggregateOutputType = {
    id: number | null
    customerId: number | null
    date: Date | null
    note: string | null
    includeLicenseFee: boolean | null
    paymentMethod: string | null
    tourClosedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DraftCountAggregateOutputType = {
    id: number
    customerId: number
    date: number
    note: number
    includeLicenseFee: number
    paymentMethod: number
    tourClosedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DraftAvgAggregateInputType = {
    id?: true
    customerId?: true
  }

  export type DraftSumAggregateInputType = {
    id?: true
    customerId?: true
  }

  export type DraftMinAggregateInputType = {
    id?: true
    customerId?: true
    date?: true
    note?: true
    includeLicenseFee?: true
    paymentMethod?: true
    tourClosedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DraftMaxAggregateInputType = {
    id?: true
    customerId?: true
    date?: true
    note?: true
    includeLicenseFee?: true
    paymentMethod?: true
    tourClosedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DraftCountAggregateInputType = {
    id?: true
    customerId?: true
    date?: true
    note?: true
    includeLicenseFee?: true
    paymentMethod?: true
    tourClosedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DraftAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Draft to aggregate.
     */
    where?: DraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drafts to fetch.
     */
    orderBy?: DraftOrderByWithRelationInput | DraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drafts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Drafts
    **/
    _count?: true | DraftCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DraftAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DraftSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DraftMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DraftMaxAggregateInputType
  }

  export type GetDraftAggregateType<T extends DraftAggregateArgs> = {
        [P in keyof T & keyof AggregateDraft]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDraft[P]>
      : GetScalarType<T[P], AggregateDraft[P]>
  }




  export type DraftGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DraftWhereInput
    orderBy?: DraftOrderByWithAggregationInput | DraftOrderByWithAggregationInput[]
    by: DraftScalarFieldEnum[] | DraftScalarFieldEnum
    having?: DraftScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DraftCountAggregateInputType | true
    _avg?: DraftAvgAggregateInputType
    _sum?: DraftSumAggregateInputType
    _min?: DraftMinAggregateInputType
    _max?: DraftMaxAggregateInputType
  }

  export type DraftGroupByOutputType = {
    id: number
    customerId: number
    date: Date
    note: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: DraftCountAggregateOutputType | null
    _avg: DraftAvgAggregateOutputType | null
    _sum: DraftSumAggregateOutputType | null
    _min: DraftMinAggregateOutputType | null
    _max: DraftMaxAggregateOutputType | null
  }

  type GetDraftGroupByPayload<T extends DraftGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DraftGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DraftGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DraftGroupByOutputType[P]>
            : GetScalarType<T[P], DraftGroupByOutputType[P]>
        }
      >
    >


  export type DraftSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    date?: boolean
    note?: boolean
    includeLicenseFee?: boolean
    paymentMethod?: boolean
    tourClosedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    lines?: boolean | Draft$linesArgs<ExtArgs>
    revisions?: boolean | Draft$revisionsArgs<ExtArgs>
    _count?: boolean | DraftCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["draft"]>

  export type DraftSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    date?: boolean
    note?: boolean
    includeLicenseFee?: boolean
    paymentMethod?: boolean
    tourClosedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["draft"]>

  export type DraftSelectScalar = {
    id?: boolean
    customerId?: boolean
    date?: boolean
    note?: boolean
    includeLicenseFee?: boolean
    paymentMethod?: boolean
    tourClosedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DraftInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    lines?: boolean | Draft$linesArgs<ExtArgs>
    revisions?: boolean | Draft$revisionsArgs<ExtArgs>
    _count?: boolean | DraftCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DraftIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }

  export type $DraftPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Draft"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      lines: Prisma.$DraftLinePayload<ExtArgs>[]
      revisions: Prisma.$InvoiceRevisionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      customerId: number
      date: Date
      note: string | null
      includeLicenseFee: boolean
      paymentMethod: string
      tourClosedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["draft"]>
    composites: {}
  }

  type DraftGetPayload<S extends boolean | null | undefined | DraftDefaultArgs> = $Result.GetResult<Prisma.$DraftPayload, S>

  type DraftCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DraftFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DraftCountAggregateInputType | true
    }

  export interface DraftDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Draft'], meta: { name: 'Draft' } }
    /**
     * Find zero or one Draft that matches the filter.
     * @param {DraftFindUniqueArgs} args - Arguments to find a Draft
     * @example
     * // Get one Draft
     * const draft = await prisma.draft.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DraftFindUniqueArgs>(args: SelectSubset<T, DraftFindUniqueArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Draft that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DraftFindUniqueOrThrowArgs} args - Arguments to find a Draft
     * @example
     * // Get one Draft
     * const draft = await prisma.draft.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DraftFindUniqueOrThrowArgs>(args: SelectSubset<T, DraftFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Draft that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftFindFirstArgs} args - Arguments to find a Draft
     * @example
     * // Get one Draft
     * const draft = await prisma.draft.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DraftFindFirstArgs>(args?: SelectSubset<T, DraftFindFirstArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Draft that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftFindFirstOrThrowArgs} args - Arguments to find a Draft
     * @example
     * // Get one Draft
     * const draft = await prisma.draft.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DraftFindFirstOrThrowArgs>(args?: SelectSubset<T, DraftFindFirstOrThrowArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Drafts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Drafts
     * const drafts = await prisma.draft.findMany()
     * 
     * // Get first 10 Drafts
     * const drafts = await prisma.draft.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const draftWithIdOnly = await prisma.draft.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DraftFindManyArgs>(args?: SelectSubset<T, DraftFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Draft.
     * @param {DraftCreateArgs} args - Arguments to create a Draft.
     * @example
     * // Create one Draft
     * const Draft = await prisma.draft.create({
     *   data: {
     *     // ... data to create a Draft
     *   }
     * })
     * 
     */
    create<T extends DraftCreateArgs>(args: SelectSubset<T, DraftCreateArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Drafts.
     * @param {DraftCreateManyArgs} args - Arguments to create many Drafts.
     * @example
     * // Create many Drafts
     * const draft = await prisma.draft.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DraftCreateManyArgs>(args?: SelectSubset<T, DraftCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Drafts and returns the data saved in the database.
     * @param {DraftCreateManyAndReturnArgs} args - Arguments to create many Drafts.
     * @example
     * // Create many Drafts
     * const draft = await prisma.draft.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Drafts and only return the `id`
     * const draftWithIdOnly = await prisma.draft.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DraftCreateManyAndReturnArgs>(args?: SelectSubset<T, DraftCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Draft.
     * @param {DraftDeleteArgs} args - Arguments to delete one Draft.
     * @example
     * // Delete one Draft
     * const Draft = await prisma.draft.delete({
     *   where: {
     *     // ... filter to delete one Draft
     *   }
     * })
     * 
     */
    delete<T extends DraftDeleteArgs>(args: SelectSubset<T, DraftDeleteArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Draft.
     * @param {DraftUpdateArgs} args - Arguments to update one Draft.
     * @example
     * // Update one Draft
     * const draft = await prisma.draft.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DraftUpdateArgs>(args: SelectSubset<T, DraftUpdateArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Drafts.
     * @param {DraftDeleteManyArgs} args - Arguments to filter Drafts to delete.
     * @example
     * // Delete a few Drafts
     * const { count } = await prisma.draft.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DraftDeleteManyArgs>(args?: SelectSubset<T, DraftDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Drafts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Drafts
     * const draft = await prisma.draft.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DraftUpdateManyArgs>(args: SelectSubset<T, DraftUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Draft.
     * @param {DraftUpsertArgs} args - Arguments to update or create a Draft.
     * @example
     * // Update or create a Draft
     * const draft = await prisma.draft.upsert({
     *   create: {
     *     // ... data to create a Draft
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Draft we want to update
     *   }
     * })
     */
    upsert<T extends DraftUpsertArgs>(args: SelectSubset<T, DraftUpsertArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Drafts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftCountArgs} args - Arguments to filter Drafts to count.
     * @example
     * // Count the number of Drafts
     * const count = await prisma.draft.count({
     *   where: {
     *     // ... the filter for the Drafts we want to count
     *   }
     * })
    **/
    count<T extends DraftCountArgs>(
      args?: Subset<T, DraftCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DraftCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Draft.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DraftAggregateArgs>(args: Subset<T, DraftAggregateArgs>): Prisma.PrismaPromise<GetDraftAggregateType<T>>

    /**
     * Group by Draft.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DraftGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DraftGroupByArgs['orderBy'] }
        : { orderBy?: DraftGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DraftGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDraftGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Draft model
   */
  readonly fields: DraftFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Draft.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DraftClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    lines<T extends Draft$linesArgs<ExtArgs> = {}>(args?: Subset<T, Draft$linesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "findMany"> | Null>
    revisions<T extends Draft$revisionsArgs<ExtArgs> = {}>(args?: Subset<T, Draft$revisionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Draft model
   */ 
  interface DraftFieldRefs {
    readonly id: FieldRef<"Draft", 'Int'>
    readonly customerId: FieldRef<"Draft", 'Int'>
    readonly date: FieldRef<"Draft", 'DateTime'>
    readonly note: FieldRef<"Draft", 'String'>
    readonly includeLicenseFee: FieldRef<"Draft", 'Boolean'>
    readonly paymentMethod: FieldRef<"Draft", 'String'>
    readonly tourClosedAt: FieldRef<"Draft", 'DateTime'>
    readonly createdAt: FieldRef<"Draft", 'DateTime'>
    readonly updatedAt: FieldRef<"Draft", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Draft findUnique
   */
  export type DraftFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * Filter, which Draft to fetch.
     */
    where: DraftWhereUniqueInput
  }

  /**
   * Draft findUniqueOrThrow
   */
  export type DraftFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * Filter, which Draft to fetch.
     */
    where: DraftWhereUniqueInput
  }

  /**
   * Draft findFirst
   */
  export type DraftFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * Filter, which Draft to fetch.
     */
    where?: DraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drafts to fetch.
     */
    orderBy?: DraftOrderByWithRelationInput | DraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Drafts.
     */
    cursor?: DraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drafts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Drafts.
     */
    distinct?: DraftScalarFieldEnum | DraftScalarFieldEnum[]
  }

  /**
   * Draft findFirstOrThrow
   */
  export type DraftFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * Filter, which Draft to fetch.
     */
    where?: DraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drafts to fetch.
     */
    orderBy?: DraftOrderByWithRelationInput | DraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Drafts.
     */
    cursor?: DraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drafts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Drafts.
     */
    distinct?: DraftScalarFieldEnum | DraftScalarFieldEnum[]
  }

  /**
   * Draft findMany
   */
  export type DraftFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * Filter, which Drafts to fetch.
     */
    where?: DraftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drafts to fetch.
     */
    orderBy?: DraftOrderByWithRelationInput | DraftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Drafts.
     */
    cursor?: DraftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drafts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drafts.
     */
    skip?: number
    distinct?: DraftScalarFieldEnum | DraftScalarFieldEnum[]
  }

  /**
   * Draft create
   */
  export type DraftCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * The data needed to create a Draft.
     */
    data: XOR<DraftCreateInput, DraftUncheckedCreateInput>
  }

  /**
   * Draft createMany
   */
  export type DraftCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Drafts.
     */
    data: DraftCreateManyInput | DraftCreateManyInput[]
  }

  /**
   * Draft createManyAndReturn
   */
  export type DraftCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Drafts.
     */
    data: DraftCreateManyInput | DraftCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Draft update
   */
  export type DraftUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * The data needed to update a Draft.
     */
    data: XOR<DraftUpdateInput, DraftUncheckedUpdateInput>
    /**
     * Choose, which Draft to update.
     */
    where: DraftWhereUniqueInput
  }

  /**
   * Draft updateMany
   */
  export type DraftUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Drafts.
     */
    data: XOR<DraftUpdateManyMutationInput, DraftUncheckedUpdateManyInput>
    /**
     * Filter which Drafts to update
     */
    where?: DraftWhereInput
  }

  /**
   * Draft upsert
   */
  export type DraftUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * The filter to search for the Draft to update in case it exists.
     */
    where: DraftWhereUniqueInput
    /**
     * In case the Draft found by the `where` argument doesn't exist, create a new Draft with this data.
     */
    create: XOR<DraftCreateInput, DraftUncheckedCreateInput>
    /**
     * In case the Draft was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DraftUpdateInput, DraftUncheckedUpdateInput>
  }

  /**
   * Draft delete
   */
  export type DraftDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
    /**
     * Filter which Draft to delete.
     */
    where: DraftWhereUniqueInput
  }

  /**
   * Draft deleteMany
   */
  export type DraftDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Drafts to delete
     */
    where?: DraftWhereInput
  }

  /**
   * Draft.lines
   */
  export type Draft$linesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    where?: DraftLineWhereInput
    orderBy?: DraftLineOrderByWithRelationInput | DraftLineOrderByWithRelationInput[]
    cursor?: DraftLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DraftLineScalarFieldEnum | DraftLineScalarFieldEnum[]
  }

  /**
   * Draft.revisions
   */
  export type Draft$revisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    where?: InvoiceRevisionWhereInput
    orderBy?: InvoiceRevisionOrderByWithRelationInput | InvoiceRevisionOrderByWithRelationInput[]
    cursor?: InvoiceRevisionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceRevisionScalarFieldEnum | InvoiceRevisionScalarFieldEnum[]
  }

  /**
   * Draft without action
   */
  export type DraftDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Draft
     */
    select?: DraftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftInclude<ExtArgs> | null
  }


  /**
   * Model DraftLine
   */

  export type AggregateDraftLine = {
    _count: DraftLineCountAggregateOutputType | null
    _avg: DraftLineAvgAggregateOutputType | null
    _sum: DraftLineSumAggregateOutputType | null
    _min: DraftLineMinAggregateOutputType | null
    _max: DraftLineMaxAggregateOutputType | null
  }

  export type DraftLineAvgAggregateOutputType = {
    id: number | null
    draftId: number | null
    productId: number | null
    quantity: number | null
    unitPriceCents: number | null
  }

  export type DraftLineSumAggregateOutputType = {
    id: number | null
    draftId: number | null
    productId: number | null
    quantity: number | null
    unitPriceCents: number | null
  }

  export type DraftLineMinAggregateOutputType = {
    id: number | null
    draftId: number | null
    productId: number | null
    quantity: number | null
    unitPriceCents: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DraftLineMaxAggregateOutputType = {
    id: number | null
    draftId: number | null
    productId: number | null
    quantity: number | null
    unitPriceCents: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DraftLineCountAggregateOutputType = {
    id: number
    draftId: number
    productId: number
    quantity: number
    unitPriceCents: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DraftLineAvgAggregateInputType = {
    id?: true
    draftId?: true
    productId?: true
    quantity?: true
    unitPriceCents?: true
  }

  export type DraftLineSumAggregateInputType = {
    id?: true
    draftId?: true
    productId?: true
    quantity?: true
    unitPriceCents?: true
  }

  export type DraftLineMinAggregateInputType = {
    id?: true
    draftId?: true
    productId?: true
    quantity?: true
    unitPriceCents?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DraftLineMaxAggregateInputType = {
    id?: true
    draftId?: true
    productId?: true
    quantity?: true
    unitPriceCents?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DraftLineCountAggregateInputType = {
    id?: true
    draftId?: true
    productId?: true
    quantity?: true
    unitPriceCents?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DraftLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DraftLine to aggregate.
     */
    where?: DraftLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DraftLines to fetch.
     */
    orderBy?: DraftLineOrderByWithRelationInput | DraftLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DraftLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DraftLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DraftLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DraftLines
    **/
    _count?: true | DraftLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DraftLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DraftLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DraftLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DraftLineMaxAggregateInputType
  }

  export type GetDraftLineAggregateType<T extends DraftLineAggregateArgs> = {
        [P in keyof T & keyof AggregateDraftLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDraftLine[P]>
      : GetScalarType<T[P], AggregateDraftLine[P]>
  }




  export type DraftLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DraftLineWhereInput
    orderBy?: DraftLineOrderByWithAggregationInput | DraftLineOrderByWithAggregationInput[]
    by: DraftLineScalarFieldEnum[] | DraftLineScalarFieldEnum
    having?: DraftLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DraftLineCountAggregateInputType | true
    _avg?: DraftLineAvgAggregateInputType
    _sum?: DraftLineSumAggregateInputType
    _min?: DraftLineMinAggregateInputType
    _max?: DraftLineMaxAggregateInputType
  }

  export type DraftLineGroupByOutputType = {
    id: number
    draftId: number
    productId: number
    quantity: number
    unitPriceCents: number
    createdAt: Date
    updatedAt: Date
    _count: DraftLineCountAggregateOutputType | null
    _avg: DraftLineAvgAggregateOutputType | null
    _sum: DraftLineSumAggregateOutputType | null
    _min: DraftLineMinAggregateOutputType | null
    _max: DraftLineMaxAggregateOutputType | null
  }

  type GetDraftLineGroupByPayload<T extends DraftLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DraftLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DraftLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DraftLineGroupByOutputType[P]>
            : GetScalarType<T[P], DraftLineGroupByOutputType[P]>
        }
      >
    >


  export type DraftLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    draftId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPriceCents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    draft?: boolean | DraftDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["draftLine"]>

  export type DraftLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    draftId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPriceCents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    draft?: boolean | DraftDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["draftLine"]>

  export type DraftLineSelectScalar = {
    id?: boolean
    draftId?: boolean
    productId?: boolean
    quantity?: boolean
    unitPriceCents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DraftLineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    draft?: boolean | DraftDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type DraftLineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    draft?: boolean | DraftDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $DraftLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DraftLine"
    objects: {
      draft: Prisma.$DraftPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      draftId: number
      productId: number
      quantity: number
      unitPriceCents: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["draftLine"]>
    composites: {}
  }

  type DraftLineGetPayload<S extends boolean | null | undefined | DraftLineDefaultArgs> = $Result.GetResult<Prisma.$DraftLinePayload, S>

  type DraftLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DraftLineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DraftLineCountAggregateInputType | true
    }

  export interface DraftLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DraftLine'], meta: { name: 'DraftLine' } }
    /**
     * Find zero or one DraftLine that matches the filter.
     * @param {DraftLineFindUniqueArgs} args - Arguments to find a DraftLine
     * @example
     * // Get one DraftLine
     * const draftLine = await prisma.draftLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DraftLineFindUniqueArgs>(args: SelectSubset<T, DraftLineFindUniqueArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DraftLine that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DraftLineFindUniqueOrThrowArgs} args - Arguments to find a DraftLine
     * @example
     * // Get one DraftLine
     * const draftLine = await prisma.draftLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DraftLineFindUniqueOrThrowArgs>(args: SelectSubset<T, DraftLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DraftLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftLineFindFirstArgs} args - Arguments to find a DraftLine
     * @example
     * // Get one DraftLine
     * const draftLine = await prisma.draftLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DraftLineFindFirstArgs>(args?: SelectSubset<T, DraftLineFindFirstArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DraftLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftLineFindFirstOrThrowArgs} args - Arguments to find a DraftLine
     * @example
     * // Get one DraftLine
     * const draftLine = await prisma.draftLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DraftLineFindFirstOrThrowArgs>(args?: SelectSubset<T, DraftLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DraftLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DraftLines
     * const draftLines = await prisma.draftLine.findMany()
     * 
     * // Get first 10 DraftLines
     * const draftLines = await prisma.draftLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const draftLineWithIdOnly = await prisma.draftLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DraftLineFindManyArgs>(args?: SelectSubset<T, DraftLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DraftLine.
     * @param {DraftLineCreateArgs} args - Arguments to create a DraftLine.
     * @example
     * // Create one DraftLine
     * const DraftLine = await prisma.draftLine.create({
     *   data: {
     *     // ... data to create a DraftLine
     *   }
     * })
     * 
     */
    create<T extends DraftLineCreateArgs>(args: SelectSubset<T, DraftLineCreateArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DraftLines.
     * @param {DraftLineCreateManyArgs} args - Arguments to create many DraftLines.
     * @example
     * // Create many DraftLines
     * const draftLine = await prisma.draftLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DraftLineCreateManyArgs>(args?: SelectSubset<T, DraftLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DraftLines and returns the data saved in the database.
     * @param {DraftLineCreateManyAndReturnArgs} args - Arguments to create many DraftLines.
     * @example
     * // Create many DraftLines
     * const draftLine = await prisma.draftLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DraftLines and only return the `id`
     * const draftLineWithIdOnly = await prisma.draftLine.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DraftLineCreateManyAndReturnArgs>(args?: SelectSubset<T, DraftLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DraftLine.
     * @param {DraftLineDeleteArgs} args - Arguments to delete one DraftLine.
     * @example
     * // Delete one DraftLine
     * const DraftLine = await prisma.draftLine.delete({
     *   where: {
     *     // ... filter to delete one DraftLine
     *   }
     * })
     * 
     */
    delete<T extends DraftLineDeleteArgs>(args: SelectSubset<T, DraftLineDeleteArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DraftLine.
     * @param {DraftLineUpdateArgs} args - Arguments to update one DraftLine.
     * @example
     * // Update one DraftLine
     * const draftLine = await prisma.draftLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DraftLineUpdateArgs>(args: SelectSubset<T, DraftLineUpdateArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DraftLines.
     * @param {DraftLineDeleteManyArgs} args - Arguments to filter DraftLines to delete.
     * @example
     * // Delete a few DraftLines
     * const { count } = await prisma.draftLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DraftLineDeleteManyArgs>(args?: SelectSubset<T, DraftLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DraftLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DraftLines
     * const draftLine = await prisma.draftLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DraftLineUpdateManyArgs>(args: SelectSubset<T, DraftLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DraftLine.
     * @param {DraftLineUpsertArgs} args - Arguments to update or create a DraftLine.
     * @example
     * // Update or create a DraftLine
     * const draftLine = await prisma.draftLine.upsert({
     *   create: {
     *     // ... data to create a DraftLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DraftLine we want to update
     *   }
     * })
     */
    upsert<T extends DraftLineUpsertArgs>(args: SelectSubset<T, DraftLineUpsertArgs<ExtArgs>>): Prisma__DraftLineClient<$Result.GetResult<Prisma.$DraftLinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DraftLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftLineCountArgs} args - Arguments to filter DraftLines to count.
     * @example
     * // Count the number of DraftLines
     * const count = await prisma.draftLine.count({
     *   where: {
     *     // ... the filter for the DraftLines we want to count
     *   }
     * })
    **/
    count<T extends DraftLineCountArgs>(
      args?: Subset<T, DraftLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DraftLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DraftLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DraftLineAggregateArgs>(args: Subset<T, DraftLineAggregateArgs>): Prisma.PrismaPromise<GetDraftLineAggregateType<T>>

    /**
     * Group by DraftLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DraftLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DraftLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DraftLineGroupByArgs['orderBy'] }
        : { orderBy?: DraftLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DraftLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDraftLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DraftLine model
   */
  readonly fields: DraftLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DraftLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DraftLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    draft<T extends DraftDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DraftDefaultArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DraftLine model
   */ 
  interface DraftLineFieldRefs {
    readonly id: FieldRef<"DraftLine", 'Int'>
    readonly draftId: FieldRef<"DraftLine", 'Int'>
    readonly productId: FieldRef<"DraftLine", 'Int'>
    readonly quantity: FieldRef<"DraftLine", 'Int'>
    readonly unitPriceCents: FieldRef<"DraftLine", 'Int'>
    readonly createdAt: FieldRef<"DraftLine", 'DateTime'>
    readonly updatedAt: FieldRef<"DraftLine", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DraftLine findUnique
   */
  export type DraftLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * Filter, which DraftLine to fetch.
     */
    where: DraftLineWhereUniqueInput
  }

  /**
   * DraftLine findUniqueOrThrow
   */
  export type DraftLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * Filter, which DraftLine to fetch.
     */
    where: DraftLineWhereUniqueInput
  }

  /**
   * DraftLine findFirst
   */
  export type DraftLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * Filter, which DraftLine to fetch.
     */
    where?: DraftLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DraftLines to fetch.
     */
    orderBy?: DraftLineOrderByWithRelationInput | DraftLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DraftLines.
     */
    cursor?: DraftLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DraftLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DraftLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DraftLines.
     */
    distinct?: DraftLineScalarFieldEnum | DraftLineScalarFieldEnum[]
  }

  /**
   * DraftLine findFirstOrThrow
   */
  export type DraftLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * Filter, which DraftLine to fetch.
     */
    where?: DraftLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DraftLines to fetch.
     */
    orderBy?: DraftLineOrderByWithRelationInput | DraftLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DraftLines.
     */
    cursor?: DraftLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DraftLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DraftLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DraftLines.
     */
    distinct?: DraftLineScalarFieldEnum | DraftLineScalarFieldEnum[]
  }

  /**
   * DraftLine findMany
   */
  export type DraftLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * Filter, which DraftLines to fetch.
     */
    where?: DraftLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DraftLines to fetch.
     */
    orderBy?: DraftLineOrderByWithRelationInput | DraftLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DraftLines.
     */
    cursor?: DraftLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DraftLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DraftLines.
     */
    skip?: number
    distinct?: DraftLineScalarFieldEnum | DraftLineScalarFieldEnum[]
  }

  /**
   * DraftLine create
   */
  export type DraftLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * The data needed to create a DraftLine.
     */
    data: XOR<DraftLineCreateInput, DraftLineUncheckedCreateInput>
  }

  /**
   * DraftLine createMany
   */
  export type DraftLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DraftLines.
     */
    data: DraftLineCreateManyInput | DraftLineCreateManyInput[]
  }

  /**
   * DraftLine createManyAndReturn
   */
  export type DraftLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DraftLines.
     */
    data: DraftLineCreateManyInput | DraftLineCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DraftLine update
   */
  export type DraftLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * The data needed to update a DraftLine.
     */
    data: XOR<DraftLineUpdateInput, DraftLineUncheckedUpdateInput>
    /**
     * Choose, which DraftLine to update.
     */
    where: DraftLineWhereUniqueInput
  }

  /**
   * DraftLine updateMany
   */
  export type DraftLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DraftLines.
     */
    data: XOR<DraftLineUpdateManyMutationInput, DraftLineUncheckedUpdateManyInput>
    /**
     * Filter which DraftLines to update
     */
    where?: DraftLineWhereInput
  }

  /**
   * DraftLine upsert
   */
  export type DraftLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * The filter to search for the DraftLine to update in case it exists.
     */
    where: DraftLineWhereUniqueInput
    /**
     * In case the DraftLine found by the `where` argument doesn't exist, create a new DraftLine with this data.
     */
    create: XOR<DraftLineCreateInput, DraftLineUncheckedCreateInput>
    /**
     * In case the DraftLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DraftLineUpdateInput, DraftLineUncheckedUpdateInput>
  }

  /**
   * DraftLine delete
   */
  export type DraftLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
    /**
     * Filter which DraftLine to delete.
     */
    where: DraftLineWhereUniqueInput
  }

  /**
   * DraftLine deleteMany
   */
  export type DraftLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DraftLines to delete
     */
    where?: DraftLineWhereInput
  }

  /**
   * DraftLine without action
   */
  export type DraftLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DraftLine
     */
    select?: DraftLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DraftLineInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceRevision
   */

  export type AggregateInvoiceRevision = {
    _count: InvoiceRevisionCountAggregateOutputType | null
    _avg: InvoiceRevisionAvgAggregateOutputType | null
    _sum: InvoiceRevisionSumAggregateOutputType | null
    _min: InvoiceRevisionMinAggregateOutputType | null
    _max: InvoiceRevisionMaxAggregateOutputType | null
  }

  export type InvoiceRevisionAvgAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    createdBy: number | null
  }

  export type InvoiceRevisionSumAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    createdBy: number | null
  }

  export type InvoiceRevisionMinAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    payloadJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: number | null
  }

  export type InvoiceRevisionMaxAggregateOutputType = {
    id: number | null
    invoiceId: number | null
    payloadJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: number | null
  }

  export type InvoiceRevisionCountAggregateOutputType = {
    id: number
    invoiceId: number
    payloadJson: number
    createdAt: number
    updatedAt: number
    createdBy: number
    _all: number
  }


  export type InvoiceRevisionAvgAggregateInputType = {
    id?: true
    invoiceId?: true
    createdBy?: true
  }

  export type InvoiceRevisionSumAggregateInputType = {
    id?: true
    invoiceId?: true
    createdBy?: true
  }

  export type InvoiceRevisionMinAggregateInputType = {
    id?: true
    invoiceId?: true
    payloadJson?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
  }

  export type InvoiceRevisionMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    payloadJson?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
  }

  export type InvoiceRevisionCountAggregateInputType = {
    id?: true
    invoiceId?: true
    payloadJson?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    _all?: true
  }

  export type InvoiceRevisionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceRevision to aggregate.
     */
    where?: InvoiceRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceRevisions to fetch.
     */
    orderBy?: InvoiceRevisionOrderByWithRelationInput | InvoiceRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceRevisions
    **/
    _count?: true | InvoiceRevisionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceRevisionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceRevisionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceRevisionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceRevisionMaxAggregateInputType
  }

  export type GetInvoiceRevisionAggregateType<T extends InvoiceRevisionAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceRevision]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceRevision[P]>
      : GetScalarType<T[P], AggregateInvoiceRevision[P]>
  }




  export type InvoiceRevisionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceRevisionWhereInput
    orderBy?: InvoiceRevisionOrderByWithAggregationInput | InvoiceRevisionOrderByWithAggregationInput[]
    by: InvoiceRevisionScalarFieldEnum[] | InvoiceRevisionScalarFieldEnum
    having?: InvoiceRevisionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceRevisionCountAggregateInputType | true
    _avg?: InvoiceRevisionAvgAggregateInputType
    _sum?: InvoiceRevisionSumAggregateInputType
    _min?: InvoiceRevisionMinAggregateInputType
    _max?: InvoiceRevisionMaxAggregateInputType
  }

  export type InvoiceRevisionGroupByOutputType = {
    id: number
    invoiceId: number
    payloadJson: string
    createdAt: Date
    updatedAt: Date
    createdBy: number | null
    _count: InvoiceRevisionCountAggregateOutputType | null
    _avg: InvoiceRevisionAvgAggregateOutputType | null
    _sum: InvoiceRevisionSumAggregateOutputType | null
    _min: InvoiceRevisionMinAggregateOutputType | null
    _max: InvoiceRevisionMaxAggregateOutputType | null
  }

  type GetInvoiceRevisionGroupByPayload<T extends InvoiceRevisionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceRevisionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceRevisionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceRevisionGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceRevisionGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceRevisionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    invoice?: boolean | DraftDefaultArgs<ExtArgs>
    author?: boolean | InvoiceRevision$authorArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceRevision"]>

  export type InvoiceRevisionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    invoice?: boolean | DraftDefaultArgs<ExtArgs>
    author?: boolean | InvoiceRevision$authorArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceRevision"]>

  export type InvoiceRevisionSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
  }

  export type InvoiceRevisionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | DraftDefaultArgs<ExtArgs>
    author?: boolean | InvoiceRevision$authorArgs<ExtArgs>
  }
  export type InvoiceRevisionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | DraftDefaultArgs<ExtArgs>
    author?: boolean | InvoiceRevision$authorArgs<ExtArgs>
  }

  export type $InvoiceRevisionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceRevision"
    objects: {
      invoice: Prisma.$DraftPayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      invoiceId: number
      payloadJson: string
      createdAt: Date
      updatedAt: Date
      createdBy: number | null
    }, ExtArgs["result"]["invoiceRevision"]>
    composites: {}
  }

  type InvoiceRevisionGetPayload<S extends boolean | null | undefined | InvoiceRevisionDefaultArgs> = $Result.GetResult<Prisma.$InvoiceRevisionPayload, S>

  type InvoiceRevisionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceRevisionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceRevisionCountAggregateInputType | true
    }

  export interface InvoiceRevisionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceRevision'], meta: { name: 'InvoiceRevision' } }
    /**
     * Find zero or one InvoiceRevision that matches the filter.
     * @param {InvoiceRevisionFindUniqueArgs} args - Arguments to find a InvoiceRevision
     * @example
     * // Get one InvoiceRevision
     * const invoiceRevision = await prisma.invoiceRevision.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceRevisionFindUniqueArgs>(args: SelectSubset<T, InvoiceRevisionFindUniqueArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InvoiceRevision that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceRevisionFindUniqueOrThrowArgs} args - Arguments to find a InvoiceRevision
     * @example
     * // Get one InvoiceRevision
     * const invoiceRevision = await prisma.invoiceRevision.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceRevisionFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceRevisionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InvoiceRevision that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceRevisionFindFirstArgs} args - Arguments to find a InvoiceRevision
     * @example
     * // Get one InvoiceRevision
     * const invoiceRevision = await prisma.invoiceRevision.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceRevisionFindFirstArgs>(args?: SelectSubset<T, InvoiceRevisionFindFirstArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InvoiceRevision that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceRevisionFindFirstOrThrowArgs} args - Arguments to find a InvoiceRevision
     * @example
     * // Get one InvoiceRevision
     * const invoiceRevision = await prisma.invoiceRevision.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceRevisionFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceRevisionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InvoiceRevisions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceRevisionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceRevisions
     * const invoiceRevisions = await prisma.invoiceRevision.findMany()
     * 
     * // Get first 10 InvoiceRevisions
     * const invoiceRevisions = await prisma.invoiceRevision.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceRevisionWithIdOnly = await prisma.invoiceRevision.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceRevisionFindManyArgs>(args?: SelectSubset<T, InvoiceRevisionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InvoiceRevision.
     * @param {InvoiceRevisionCreateArgs} args - Arguments to create a InvoiceRevision.
     * @example
     * // Create one InvoiceRevision
     * const InvoiceRevision = await prisma.invoiceRevision.create({
     *   data: {
     *     // ... data to create a InvoiceRevision
     *   }
     * })
     * 
     */
    create<T extends InvoiceRevisionCreateArgs>(args: SelectSubset<T, InvoiceRevisionCreateArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InvoiceRevisions.
     * @param {InvoiceRevisionCreateManyArgs} args - Arguments to create many InvoiceRevisions.
     * @example
     * // Create many InvoiceRevisions
     * const invoiceRevision = await prisma.invoiceRevision.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceRevisionCreateManyArgs>(args?: SelectSubset<T, InvoiceRevisionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvoiceRevisions and returns the data saved in the database.
     * @param {InvoiceRevisionCreateManyAndReturnArgs} args - Arguments to create many InvoiceRevisions.
     * @example
     * // Create many InvoiceRevisions
     * const invoiceRevision = await prisma.invoiceRevision.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvoiceRevisions and only return the `id`
     * const invoiceRevisionWithIdOnly = await prisma.invoiceRevision.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceRevisionCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceRevisionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InvoiceRevision.
     * @param {InvoiceRevisionDeleteArgs} args - Arguments to delete one InvoiceRevision.
     * @example
     * // Delete one InvoiceRevision
     * const InvoiceRevision = await prisma.invoiceRevision.delete({
     *   where: {
     *     // ... filter to delete one InvoiceRevision
     *   }
     * })
     * 
     */
    delete<T extends InvoiceRevisionDeleteArgs>(args: SelectSubset<T, InvoiceRevisionDeleteArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InvoiceRevision.
     * @param {InvoiceRevisionUpdateArgs} args - Arguments to update one InvoiceRevision.
     * @example
     * // Update one InvoiceRevision
     * const invoiceRevision = await prisma.invoiceRevision.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceRevisionUpdateArgs>(args: SelectSubset<T, InvoiceRevisionUpdateArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InvoiceRevisions.
     * @param {InvoiceRevisionDeleteManyArgs} args - Arguments to filter InvoiceRevisions to delete.
     * @example
     * // Delete a few InvoiceRevisions
     * const { count } = await prisma.invoiceRevision.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceRevisionDeleteManyArgs>(args?: SelectSubset<T, InvoiceRevisionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceRevisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceRevisionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceRevisions
     * const invoiceRevision = await prisma.invoiceRevision.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceRevisionUpdateManyArgs>(args: SelectSubset<T, InvoiceRevisionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvoiceRevision.
     * @param {InvoiceRevisionUpsertArgs} args - Arguments to update or create a InvoiceRevision.
     * @example
     * // Update or create a InvoiceRevision
     * const invoiceRevision = await prisma.invoiceRevision.upsert({
     *   create: {
     *     // ... data to create a InvoiceRevision
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceRevision we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceRevisionUpsertArgs>(args: SelectSubset<T, InvoiceRevisionUpsertArgs<ExtArgs>>): Prisma__InvoiceRevisionClient<$Result.GetResult<Prisma.$InvoiceRevisionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InvoiceRevisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceRevisionCountArgs} args - Arguments to filter InvoiceRevisions to count.
     * @example
     * // Count the number of InvoiceRevisions
     * const count = await prisma.invoiceRevision.count({
     *   where: {
     *     // ... the filter for the InvoiceRevisions we want to count
     *   }
     * })
    **/
    count<T extends InvoiceRevisionCountArgs>(
      args?: Subset<T, InvoiceRevisionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceRevisionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceRevision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceRevisionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceRevisionAggregateArgs>(args: Subset<T, InvoiceRevisionAggregateArgs>): Prisma.PrismaPromise<GetInvoiceRevisionAggregateType<T>>

    /**
     * Group by InvoiceRevision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceRevisionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceRevisionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceRevisionGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceRevisionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceRevisionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceRevisionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceRevision model
   */
  readonly fields: InvoiceRevisionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceRevision.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceRevisionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends DraftDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DraftDefaultArgs<ExtArgs>>): Prisma__DraftClient<$Result.GetResult<Prisma.$DraftPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    author<T extends InvoiceRevision$authorArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceRevision$authorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceRevision model
   */ 
  interface InvoiceRevisionFieldRefs {
    readonly id: FieldRef<"InvoiceRevision", 'Int'>
    readonly invoiceId: FieldRef<"InvoiceRevision", 'Int'>
    readonly payloadJson: FieldRef<"InvoiceRevision", 'String'>
    readonly createdAt: FieldRef<"InvoiceRevision", 'DateTime'>
    readonly updatedAt: FieldRef<"InvoiceRevision", 'DateTime'>
    readonly createdBy: FieldRef<"InvoiceRevision", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceRevision findUnique
   */
  export type InvoiceRevisionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceRevision to fetch.
     */
    where: InvoiceRevisionWhereUniqueInput
  }

  /**
   * InvoiceRevision findUniqueOrThrow
   */
  export type InvoiceRevisionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceRevision to fetch.
     */
    where: InvoiceRevisionWhereUniqueInput
  }

  /**
   * InvoiceRevision findFirst
   */
  export type InvoiceRevisionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceRevision to fetch.
     */
    where?: InvoiceRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceRevisions to fetch.
     */
    orderBy?: InvoiceRevisionOrderByWithRelationInput | InvoiceRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceRevisions.
     */
    cursor?: InvoiceRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceRevisions.
     */
    distinct?: InvoiceRevisionScalarFieldEnum | InvoiceRevisionScalarFieldEnum[]
  }

  /**
   * InvoiceRevision findFirstOrThrow
   */
  export type InvoiceRevisionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceRevision to fetch.
     */
    where?: InvoiceRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceRevisions to fetch.
     */
    orderBy?: InvoiceRevisionOrderByWithRelationInput | InvoiceRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceRevisions.
     */
    cursor?: InvoiceRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceRevisions.
     */
    distinct?: InvoiceRevisionScalarFieldEnum | InvoiceRevisionScalarFieldEnum[]
  }

  /**
   * InvoiceRevision findMany
   */
  export type InvoiceRevisionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceRevisions to fetch.
     */
    where?: InvoiceRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceRevisions to fetch.
     */
    orderBy?: InvoiceRevisionOrderByWithRelationInput | InvoiceRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceRevisions.
     */
    cursor?: InvoiceRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceRevisions.
     */
    skip?: number
    distinct?: InvoiceRevisionScalarFieldEnum | InvoiceRevisionScalarFieldEnum[]
  }

  /**
   * InvoiceRevision create
   */
  export type InvoiceRevisionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceRevision.
     */
    data: XOR<InvoiceRevisionCreateInput, InvoiceRevisionUncheckedCreateInput>
  }

  /**
   * InvoiceRevision createMany
   */
  export type InvoiceRevisionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceRevisions.
     */
    data: InvoiceRevisionCreateManyInput | InvoiceRevisionCreateManyInput[]
  }

  /**
   * InvoiceRevision createManyAndReturn
   */
  export type InvoiceRevisionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InvoiceRevisions.
     */
    data: InvoiceRevisionCreateManyInput | InvoiceRevisionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceRevision update
   */
  export type InvoiceRevisionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceRevision.
     */
    data: XOR<InvoiceRevisionUpdateInput, InvoiceRevisionUncheckedUpdateInput>
    /**
     * Choose, which InvoiceRevision to update.
     */
    where: InvoiceRevisionWhereUniqueInput
  }

  /**
   * InvoiceRevision updateMany
   */
  export type InvoiceRevisionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceRevisions.
     */
    data: XOR<InvoiceRevisionUpdateManyMutationInput, InvoiceRevisionUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceRevisions to update
     */
    where?: InvoiceRevisionWhereInput
  }

  /**
   * InvoiceRevision upsert
   */
  export type InvoiceRevisionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceRevision to update in case it exists.
     */
    where: InvoiceRevisionWhereUniqueInput
    /**
     * In case the InvoiceRevision found by the `where` argument doesn't exist, create a new InvoiceRevision with this data.
     */
    create: XOR<InvoiceRevisionCreateInput, InvoiceRevisionUncheckedCreateInput>
    /**
     * In case the InvoiceRevision was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceRevisionUpdateInput, InvoiceRevisionUncheckedUpdateInput>
  }

  /**
   * InvoiceRevision delete
   */
  export type InvoiceRevisionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
    /**
     * Filter which InvoiceRevision to delete.
     */
    where: InvoiceRevisionWhereUniqueInput
  }

  /**
   * InvoiceRevision deleteMany
   */
  export type InvoiceRevisionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceRevisions to delete
     */
    where?: InvoiceRevisionWhereInput
  }

  /**
   * InvoiceRevision.author
   */
  export type InvoiceRevision$authorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * InvoiceRevision without action
   */
  export type InvoiceRevisionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceRevision
     */
    select?: InvoiceRevisionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceRevisionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    pinHash: 'pinHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    phone: 'phone',
    routeDay: 'routeDay',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    sku: 'sku',
    name: 'name',
    defaultPriceCents: 'defaultPriceCents',
    licenseFeeCents: 'licenseFeeCents',
    licenseMaterial: 'licenseMaterial',
    licenseWeightGrams: 'licenseWeightGrams',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProductAliasScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    alias: 'alias',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProductAliasScalarFieldEnum = (typeof ProductAliasScalarFieldEnum)[keyof typeof ProductAliasScalarFieldEnum]


  export const CustomerPriceScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    productId: 'productId',
    priceCents: 'priceCents',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerPriceScalarFieldEnum = (typeof CustomerPriceScalarFieldEnum)[keyof typeof CustomerPriceScalarFieldEnum]


  export const DraftScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    date: 'date',
    note: 'note',
    includeLicenseFee: 'includeLicenseFee',
    paymentMethod: 'paymentMethod',
    tourClosedAt: 'tourClosedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DraftScalarFieldEnum = (typeof DraftScalarFieldEnum)[keyof typeof DraftScalarFieldEnum]


  export const DraftLineScalarFieldEnum: {
    id: 'id',
    draftId: 'draftId',
    productId: 'productId',
    quantity: 'quantity',
    unitPriceCents: 'unitPriceCents',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DraftLineScalarFieldEnum = (typeof DraftLineScalarFieldEnum)[keyof typeof DraftLineScalarFieldEnum]


  export const InvoiceRevisionScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    payloadJson: 'payloadJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdBy: 'createdBy'
  };

  export type InvoiceRevisionScalarFieldEnum = (typeof InvoiceRevisionScalarFieldEnum)[keyof typeof InvoiceRevisionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    pinHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    invoiceRevisions?: InvoiceRevisionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    pinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceRevisions?: InvoiceRevisionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    pinHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    invoiceRevisions?: InvoiceRevisionListRelationFilter
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    pinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    pinHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: IntFilter<"Customer"> | number
    name?: StringFilter<"Customer"> | string
    address?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    routeDay?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    customerPrice?: CustomerPriceListRelationFilter
    drafts?: DraftListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    routeDay?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customerPrice?: CustomerPriceOrderByRelationAggregateInput
    drafts?: DraftOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    name?: StringFilter<"Customer"> | string
    address?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    routeDay?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    customerPrice?: CustomerPriceListRelationFilter
    drafts?: DraftListRelationFilter
  }, "id">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    routeDay?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _avg?: CustomerAvgOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
    _sum?: CustomerSumOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Customer"> | number
    name?: StringWithAggregatesFilter<"Customer"> | string
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    routeDay?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: IntFilter<"Product"> | number
    sku?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    defaultPriceCents?: IntNullableFilter<"Product"> | number | null
    licenseFeeCents?: IntFilter<"Product"> | number
    licenseMaterial?: StringNullableFilter<"Product"> | string | null
    licenseWeightGrams?: IntFilter<"Product"> | number
    isActive?: BoolFilter<"Product"> | boolean
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    aliases?: ProductAliasListRelationFilter
    customerPrice?: CustomerPriceListRelationFilter
    draftLines?: DraftLineListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    defaultPriceCents?: SortOrderInput | SortOrder
    licenseFeeCents?: SortOrder
    licenseMaterial?: SortOrderInput | SortOrder
    licenseWeightGrams?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    aliases?: ProductAliasOrderByRelationAggregateInput
    customerPrice?: CustomerPriceOrderByRelationAggregateInput
    draftLines?: DraftLineOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    sku?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    defaultPriceCents?: IntNullableFilter<"Product"> | number | null
    licenseFeeCents?: IntFilter<"Product"> | number
    licenseMaterial?: StringNullableFilter<"Product"> | string | null
    licenseWeightGrams?: IntFilter<"Product"> | number
    isActive?: BoolFilter<"Product"> | boolean
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    aliases?: ProductAliasListRelationFilter
    customerPrice?: CustomerPriceListRelationFilter
    draftLines?: DraftLineListRelationFilter
  }, "id" | "sku">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    defaultPriceCents?: SortOrderInput | SortOrder
    licenseFeeCents?: SortOrder
    licenseMaterial?: SortOrderInput | SortOrder
    licenseWeightGrams?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Product"> | number
    sku?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    defaultPriceCents?: IntNullableWithAggregatesFilter<"Product"> | number | null
    licenseFeeCents?: IntWithAggregatesFilter<"Product"> | number
    licenseMaterial?: StringNullableWithAggregatesFilter<"Product"> | string | null
    licenseWeightGrams?: IntWithAggregatesFilter<"Product"> | number
    isActive?: BoolWithAggregatesFilter<"Product"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
  }

  export type ProductAliasWhereInput = {
    AND?: ProductAliasWhereInput | ProductAliasWhereInput[]
    OR?: ProductAliasWhereInput[]
    NOT?: ProductAliasWhereInput | ProductAliasWhereInput[]
    id?: IntFilter<"ProductAlias"> | number
    productId?: IntFilter<"ProductAlias"> | number
    alias?: StringFilter<"ProductAlias"> | string
    createdAt?: DateTimeFilter<"ProductAlias"> | Date | string
    updatedAt?: DateTimeFilter<"ProductAlias"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type ProductAliasOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    alias?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type ProductAliasWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    productId_alias?: ProductAliasProductIdAliasCompoundUniqueInput
    AND?: ProductAliasWhereInput | ProductAliasWhereInput[]
    OR?: ProductAliasWhereInput[]
    NOT?: ProductAliasWhereInput | ProductAliasWhereInput[]
    productId?: IntFilter<"ProductAlias"> | number
    alias?: StringFilter<"ProductAlias"> | string
    createdAt?: DateTimeFilter<"ProductAlias"> | Date | string
    updatedAt?: DateTimeFilter<"ProductAlias"> | Date | string
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id" | "productId_alias">

  export type ProductAliasOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    alias?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProductAliasCountOrderByAggregateInput
    _avg?: ProductAliasAvgOrderByAggregateInput
    _max?: ProductAliasMaxOrderByAggregateInput
    _min?: ProductAliasMinOrderByAggregateInput
    _sum?: ProductAliasSumOrderByAggregateInput
  }

  export type ProductAliasScalarWhereWithAggregatesInput = {
    AND?: ProductAliasScalarWhereWithAggregatesInput | ProductAliasScalarWhereWithAggregatesInput[]
    OR?: ProductAliasScalarWhereWithAggregatesInput[]
    NOT?: ProductAliasScalarWhereWithAggregatesInput | ProductAliasScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProductAlias"> | number
    productId?: IntWithAggregatesFilter<"ProductAlias"> | number
    alias?: StringWithAggregatesFilter<"ProductAlias"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProductAlias"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductAlias"> | Date | string
  }

  export type CustomerPriceWhereInput = {
    AND?: CustomerPriceWhereInput | CustomerPriceWhereInput[]
    OR?: CustomerPriceWhereInput[]
    NOT?: CustomerPriceWhereInput | CustomerPriceWhereInput[]
    id?: IntFilter<"CustomerPrice"> | number
    customerId?: IntFilter<"CustomerPrice"> | number
    productId?: IntFilter<"CustomerPrice"> | number
    priceCents?: IntFilter<"CustomerPrice"> | number
    createdAt?: DateTimeFilter<"CustomerPrice"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerPrice"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type CustomerPriceOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type CustomerPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    customerId_productId?: CustomerPriceCustomerIdProductIdCompoundUniqueInput
    AND?: CustomerPriceWhereInput | CustomerPriceWhereInput[]
    OR?: CustomerPriceWhereInput[]
    NOT?: CustomerPriceWhereInput | CustomerPriceWhereInput[]
    customerId?: IntFilter<"CustomerPrice"> | number
    productId?: IntFilter<"CustomerPrice"> | number
    priceCents?: IntFilter<"CustomerPrice"> | number
    createdAt?: DateTimeFilter<"CustomerPrice"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerPrice"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id" | "customerId_productId">

  export type CustomerPriceOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerPriceCountOrderByAggregateInput
    _avg?: CustomerPriceAvgOrderByAggregateInput
    _max?: CustomerPriceMaxOrderByAggregateInput
    _min?: CustomerPriceMinOrderByAggregateInput
    _sum?: CustomerPriceSumOrderByAggregateInput
  }

  export type CustomerPriceScalarWhereWithAggregatesInput = {
    AND?: CustomerPriceScalarWhereWithAggregatesInput | CustomerPriceScalarWhereWithAggregatesInput[]
    OR?: CustomerPriceScalarWhereWithAggregatesInput[]
    NOT?: CustomerPriceScalarWhereWithAggregatesInput | CustomerPriceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CustomerPrice"> | number
    customerId?: IntWithAggregatesFilter<"CustomerPrice"> | number
    productId?: IntWithAggregatesFilter<"CustomerPrice"> | number
    priceCents?: IntWithAggregatesFilter<"CustomerPrice"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CustomerPrice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CustomerPrice"> | Date | string
  }

  export type DraftWhereInput = {
    AND?: DraftWhereInput | DraftWhereInput[]
    OR?: DraftWhereInput[]
    NOT?: DraftWhereInput | DraftWhereInput[]
    id?: IntFilter<"Draft"> | number
    customerId?: IntFilter<"Draft"> | number
    date?: DateTimeFilter<"Draft"> | Date | string
    note?: StringNullableFilter<"Draft"> | string | null
    includeLicenseFee?: BoolFilter<"Draft"> | boolean
    paymentMethod?: StringFilter<"Draft"> | string
    tourClosedAt?: DateTimeNullableFilter<"Draft"> | Date | string | null
    createdAt?: DateTimeFilter<"Draft"> | Date | string
    updatedAt?: DateTimeFilter<"Draft"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    lines?: DraftLineListRelationFilter
    revisions?: InvoiceRevisionListRelationFilter
  }

  export type DraftOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    date?: SortOrder
    note?: SortOrderInput | SortOrder
    includeLicenseFee?: SortOrder
    paymentMethod?: SortOrder
    tourClosedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    lines?: DraftLineOrderByRelationAggregateInput
    revisions?: InvoiceRevisionOrderByRelationAggregateInput
  }

  export type DraftWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DraftWhereInput | DraftWhereInput[]
    OR?: DraftWhereInput[]
    NOT?: DraftWhereInput | DraftWhereInput[]
    customerId?: IntFilter<"Draft"> | number
    date?: DateTimeFilter<"Draft"> | Date | string
    note?: StringNullableFilter<"Draft"> | string | null
    includeLicenseFee?: BoolFilter<"Draft"> | boolean
    paymentMethod?: StringFilter<"Draft"> | string
    tourClosedAt?: DateTimeNullableFilter<"Draft"> | Date | string | null
    createdAt?: DateTimeFilter<"Draft"> | Date | string
    updatedAt?: DateTimeFilter<"Draft"> | Date | string
    customer?: XOR<CustomerRelationFilter, CustomerWhereInput>
    lines?: DraftLineListRelationFilter
    revisions?: InvoiceRevisionListRelationFilter
  }, "id">

  export type DraftOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    date?: SortOrder
    note?: SortOrderInput | SortOrder
    includeLicenseFee?: SortOrder
    paymentMethod?: SortOrder
    tourClosedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DraftCountOrderByAggregateInput
    _avg?: DraftAvgOrderByAggregateInput
    _max?: DraftMaxOrderByAggregateInput
    _min?: DraftMinOrderByAggregateInput
    _sum?: DraftSumOrderByAggregateInput
  }

  export type DraftScalarWhereWithAggregatesInput = {
    AND?: DraftScalarWhereWithAggregatesInput | DraftScalarWhereWithAggregatesInput[]
    OR?: DraftScalarWhereWithAggregatesInput[]
    NOT?: DraftScalarWhereWithAggregatesInput | DraftScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Draft"> | number
    customerId?: IntWithAggregatesFilter<"Draft"> | number
    date?: DateTimeWithAggregatesFilter<"Draft"> | Date | string
    note?: StringNullableWithAggregatesFilter<"Draft"> | string | null
    includeLicenseFee?: BoolWithAggregatesFilter<"Draft"> | boolean
    paymentMethod?: StringWithAggregatesFilter<"Draft"> | string
    tourClosedAt?: DateTimeNullableWithAggregatesFilter<"Draft"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Draft"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Draft"> | Date | string
  }

  export type DraftLineWhereInput = {
    AND?: DraftLineWhereInput | DraftLineWhereInput[]
    OR?: DraftLineWhereInput[]
    NOT?: DraftLineWhereInput | DraftLineWhereInput[]
    id?: IntFilter<"DraftLine"> | number
    draftId?: IntFilter<"DraftLine"> | number
    productId?: IntFilter<"DraftLine"> | number
    quantity?: IntFilter<"DraftLine"> | number
    unitPriceCents?: IntFilter<"DraftLine"> | number
    createdAt?: DateTimeFilter<"DraftLine"> | Date | string
    updatedAt?: DateTimeFilter<"DraftLine"> | Date | string
    draft?: XOR<DraftRelationFilter, DraftWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }

  export type DraftLineOrderByWithRelationInput = {
    id?: SortOrder
    draftId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPriceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    draft?: DraftOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type DraftLineWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DraftLineWhereInput | DraftLineWhereInput[]
    OR?: DraftLineWhereInput[]
    NOT?: DraftLineWhereInput | DraftLineWhereInput[]
    draftId?: IntFilter<"DraftLine"> | number
    productId?: IntFilter<"DraftLine"> | number
    quantity?: IntFilter<"DraftLine"> | number
    unitPriceCents?: IntFilter<"DraftLine"> | number
    createdAt?: DateTimeFilter<"DraftLine"> | Date | string
    updatedAt?: DateTimeFilter<"DraftLine"> | Date | string
    draft?: XOR<DraftRelationFilter, DraftWhereInput>
    product?: XOR<ProductRelationFilter, ProductWhereInput>
  }, "id">

  export type DraftLineOrderByWithAggregationInput = {
    id?: SortOrder
    draftId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPriceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DraftLineCountOrderByAggregateInput
    _avg?: DraftLineAvgOrderByAggregateInput
    _max?: DraftLineMaxOrderByAggregateInput
    _min?: DraftLineMinOrderByAggregateInput
    _sum?: DraftLineSumOrderByAggregateInput
  }

  export type DraftLineScalarWhereWithAggregatesInput = {
    AND?: DraftLineScalarWhereWithAggregatesInput | DraftLineScalarWhereWithAggregatesInput[]
    OR?: DraftLineScalarWhereWithAggregatesInput[]
    NOT?: DraftLineScalarWhereWithAggregatesInput | DraftLineScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DraftLine"> | number
    draftId?: IntWithAggregatesFilter<"DraftLine"> | number
    productId?: IntWithAggregatesFilter<"DraftLine"> | number
    quantity?: IntWithAggregatesFilter<"DraftLine"> | number
    unitPriceCents?: IntWithAggregatesFilter<"DraftLine"> | number
    createdAt?: DateTimeWithAggregatesFilter<"DraftLine"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DraftLine"> | Date | string
  }

  export type InvoiceRevisionWhereInput = {
    AND?: InvoiceRevisionWhereInput | InvoiceRevisionWhereInput[]
    OR?: InvoiceRevisionWhereInput[]
    NOT?: InvoiceRevisionWhereInput | InvoiceRevisionWhereInput[]
    id?: IntFilter<"InvoiceRevision"> | number
    invoiceId?: IntFilter<"InvoiceRevision"> | number
    payloadJson?: StringFilter<"InvoiceRevision"> | string
    createdAt?: DateTimeFilter<"InvoiceRevision"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceRevision"> | Date | string
    createdBy?: IntNullableFilter<"InvoiceRevision"> | number | null
    invoice?: XOR<DraftRelationFilter, DraftWhereInput>
    author?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type InvoiceRevisionOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    invoice?: DraftOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
  }

  export type InvoiceRevisionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: InvoiceRevisionWhereInput | InvoiceRevisionWhereInput[]
    OR?: InvoiceRevisionWhereInput[]
    NOT?: InvoiceRevisionWhereInput | InvoiceRevisionWhereInput[]
    invoiceId?: IntFilter<"InvoiceRevision"> | number
    payloadJson?: StringFilter<"InvoiceRevision"> | string
    createdAt?: DateTimeFilter<"InvoiceRevision"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceRevision"> | Date | string
    createdBy?: IntNullableFilter<"InvoiceRevision"> | number | null
    invoice?: XOR<DraftRelationFilter, DraftWhereInput>
    author?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type InvoiceRevisionOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    _count?: InvoiceRevisionCountOrderByAggregateInput
    _avg?: InvoiceRevisionAvgOrderByAggregateInput
    _max?: InvoiceRevisionMaxOrderByAggregateInput
    _min?: InvoiceRevisionMinOrderByAggregateInput
    _sum?: InvoiceRevisionSumOrderByAggregateInput
  }

  export type InvoiceRevisionScalarWhereWithAggregatesInput = {
    AND?: InvoiceRevisionScalarWhereWithAggregatesInput | InvoiceRevisionScalarWhereWithAggregatesInput[]
    OR?: InvoiceRevisionScalarWhereWithAggregatesInput[]
    NOT?: InvoiceRevisionScalarWhereWithAggregatesInput | InvoiceRevisionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"InvoiceRevision"> | number
    invoiceId?: IntWithAggregatesFilter<"InvoiceRevision"> | number
    payloadJson?: StringWithAggregatesFilter<"InvoiceRevision"> | string
    createdAt?: DateTimeWithAggregatesFilter<"InvoiceRevision"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InvoiceRevision"> | Date | string
    createdBy?: IntNullableWithAggregatesFilter<"InvoiceRevision"> | number | null
  }

  export type UserCreateInput = {
    id: number
    pinHash: string
    createdAt: Date | string
    updatedAt: Date | string
    invoiceRevisions?: InvoiceRevisionCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateInput = {
    id: number
    pinHash: string
    createdAt: Date | string
    updatedAt: Date | string
    invoiceRevisions?: InvoiceRevisionUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    pinHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceRevisions?: InvoiceRevisionUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    pinHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceRevisions?: InvoiceRevisionUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateManyInput = {
    id: number
    pinHash: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    pinHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    pinHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerCreateInput = {
    id: number
    name: string
    address?: string | null
    phone?: string | null
    routeDay?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    customerPrice?: CustomerPriceCreateNestedManyWithoutCustomerInput
    drafts?: DraftCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id: number
    name: string
    address?: string | null
    phone?: string | null
    routeDay?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    customerPrice?: CustomerPriceUncheckedCreateNestedManyWithoutCustomerInput
    drafts?: DraftUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerPrice?: CustomerPriceUpdateManyWithoutCustomerNestedInput
    drafts?: DraftUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerPrice?: CustomerPriceUncheckedUpdateManyWithoutCustomerNestedInput
    drafts?: DraftUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id: number
    name: string
    address?: string | null
    phone?: string | null
    routeDay?: string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    aliases?: ProductAliasCreateNestedManyWithoutProductInput
    customerPrice?: CustomerPriceCreateNestedManyWithoutProductInput
    draftLines?: DraftLineCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    aliases?: ProductAliasUncheckedCreateNestedManyWithoutProductInput
    customerPrice?: CustomerPriceUncheckedCreateNestedManyWithoutProductInput
    draftLines?: DraftLineUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aliases?: ProductAliasUpdateManyWithoutProductNestedInput
    customerPrice?: CustomerPriceUpdateManyWithoutProductNestedInput
    draftLines?: DraftLineUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aliases?: ProductAliasUncheckedUpdateManyWithoutProductNestedInput
    customerPrice?: CustomerPriceUncheckedUpdateManyWithoutProductNestedInput
    draftLines?: DraftLineUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type ProductUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAliasCreateInput = {
    id: number
    alias: string
    createdAt: Date | string
    updatedAt: Date | string
    product: ProductCreateNestedOneWithoutAliasesInput
  }

  export type ProductAliasUncheckedCreateInput = {
    id: number
    productId: number
    alias: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type ProductAliasUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    alias?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutAliasesNestedInput
  }

  export type ProductAliasUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    alias?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAliasCreateManyInput = {
    id: number
    productId: number
    alias: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type ProductAliasUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    alias?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAliasUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    alias?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPriceCreateInput = {
    id: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
    customer: CustomerCreateNestedOneWithoutCustomerPriceInput
    product: ProductCreateNestedOneWithoutCustomerPriceInput
  }

  export type CustomerPriceUncheckedCreateInput = {
    id: number
    customerId: number
    productId: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type CustomerPriceUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutCustomerPriceNestedInput
    product?: ProductUpdateOneRequiredWithoutCustomerPriceNestedInput
  }

  export type CustomerPriceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPriceCreateManyInput = {
    id: number
    customerId: number
    productId: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type CustomerPriceUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPriceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftCreateInput = {
    id: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    customer: CustomerCreateNestedOneWithoutDraftsInput
    lines?: DraftLineCreateNestedManyWithoutDraftInput
    revisions?: InvoiceRevisionCreateNestedManyWithoutInvoiceInput
  }

  export type DraftUncheckedCreateInput = {
    id: number
    customerId: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    lines?: DraftLineUncheckedCreateNestedManyWithoutDraftInput
    revisions?: InvoiceRevisionUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type DraftUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutDraftsNestedInput
    lines?: DraftLineUpdateManyWithoutDraftNestedInput
    revisions?: InvoiceRevisionUpdateManyWithoutInvoiceNestedInput
  }

  export type DraftUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: DraftLineUncheckedUpdateManyWithoutDraftNestedInput
    revisions?: InvoiceRevisionUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type DraftCreateManyInput = {
    id: number
    customerId: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type DraftUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftLineCreateInput = {
    id: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
    draft: DraftCreateNestedOneWithoutLinesInput
    product: ProductCreateNestedOneWithoutDraftLinesInput
  }

  export type DraftLineUncheckedCreateInput = {
    id: number
    draftId: number
    productId: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type DraftLineUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    draft?: DraftUpdateOneRequiredWithoutLinesNestedInput
    product?: ProductUpdateOneRequiredWithoutDraftLinesNestedInput
  }

  export type DraftLineUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    draftId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftLineCreateManyInput = {
    id: number
    draftId: number
    productId: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type DraftLineUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftLineUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    draftId?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceRevisionCreateInput = {
    id: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
    invoice: DraftCreateNestedOneWithoutRevisionsInput
    author?: UserCreateNestedOneWithoutInvoiceRevisionsInput
  }

  export type InvoiceRevisionUncheckedCreateInput = {
    id: number
    invoiceId: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
    createdBy?: number | null
  }

  export type InvoiceRevisionUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: DraftUpdateOneRequiredWithoutRevisionsNestedInput
    author?: UserUpdateOneWithoutInvoiceRevisionsNestedInput
  }

  export type InvoiceRevisionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type InvoiceRevisionCreateManyInput = {
    id: number
    invoiceId: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
    createdBy?: number | null
  }

  export type InvoiceRevisionUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceRevisionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type InvoiceRevisionListRelationFilter = {
    every?: InvoiceRevisionWhereInput
    some?: InvoiceRevisionWhereInput
    none?: InvoiceRevisionWhereInput
  }

  export type InvoiceRevisionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    pinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    pinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    pinHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type CustomerPriceListRelationFilter = {
    every?: CustomerPriceWhereInput
    some?: CustomerPriceWhereInput
    none?: CustomerPriceWhereInput
  }

  export type DraftListRelationFilter = {
    every?: DraftWhereInput
    some?: DraftWhereInput
    none?: DraftWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CustomerPriceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DraftOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    routeDay?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    routeDay?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    routeDay?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ProductAliasListRelationFilter = {
    every?: ProductAliasWhereInput
    some?: ProductAliasWhereInput
    none?: ProductAliasWhereInput
  }

  export type DraftLineListRelationFilter = {
    every?: DraftLineWhereInput
    some?: DraftLineWhereInput
    none?: DraftLineWhereInput
  }

  export type ProductAliasOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DraftLineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    defaultPriceCents?: SortOrder
    licenseFeeCents?: SortOrder
    licenseMaterial?: SortOrder
    licenseWeightGrams?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    id?: SortOrder
    defaultPriceCents?: SortOrder
    licenseFeeCents?: SortOrder
    licenseWeightGrams?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    defaultPriceCents?: SortOrder
    licenseFeeCents?: SortOrder
    licenseMaterial?: SortOrder
    licenseWeightGrams?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    sku?: SortOrder
    name?: SortOrder
    defaultPriceCents?: SortOrder
    licenseFeeCents?: SortOrder
    licenseMaterial?: SortOrder
    licenseWeightGrams?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    id?: SortOrder
    defaultPriceCents?: SortOrder
    licenseFeeCents?: SortOrder
    licenseWeightGrams?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProductRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductAliasProductIdAliasCompoundUniqueInput = {
    productId: number
    alias: string
  }

  export type ProductAliasCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    alias?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAliasAvgOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
  }

  export type ProductAliasMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    alias?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAliasMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    alias?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProductAliasSumOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
  }

  export type CustomerRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type CustomerPriceCustomerIdProductIdCompoundUniqueInput = {
    customerId: number
    productId: number
  }

  export type CustomerPriceCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerPriceAvgOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    priceCents?: SortOrder
  }

  export type CustomerPriceMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerPriceMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    priceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerPriceSumOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    productId?: SortOrder
    priceCents?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DraftCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    date?: SortOrder
    note?: SortOrder
    includeLicenseFee?: SortOrder
    paymentMethod?: SortOrder
    tourClosedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DraftAvgOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
  }

  export type DraftMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    date?: SortOrder
    note?: SortOrder
    includeLicenseFee?: SortOrder
    paymentMethod?: SortOrder
    tourClosedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DraftMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    date?: SortOrder
    note?: SortOrder
    includeLicenseFee?: SortOrder
    paymentMethod?: SortOrder
    tourClosedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DraftSumOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DraftRelationFilter = {
    is?: DraftWhereInput
    isNot?: DraftWhereInput
  }

  export type DraftLineCountOrderByAggregateInput = {
    id?: SortOrder
    draftId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPriceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DraftLineAvgOrderByAggregateInput = {
    id?: SortOrder
    draftId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPriceCents?: SortOrder
  }

  export type DraftLineMaxOrderByAggregateInput = {
    id?: SortOrder
    draftId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPriceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DraftLineMinOrderByAggregateInput = {
    id?: SortOrder
    draftId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPriceCents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DraftLineSumOrderByAggregateInput = {
    id?: SortOrder
    draftId?: SortOrder
    productId?: SortOrder
    quantity?: SortOrder
    unitPriceCents?: SortOrder
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type InvoiceRevisionCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type InvoiceRevisionAvgOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    createdBy?: SortOrder
  }

  export type InvoiceRevisionMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type InvoiceRevisionMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type InvoiceRevisionSumOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    createdBy?: SortOrder
  }

  export type InvoiceRevisionCreateNestedManyWithoutAuthorInput = {
    create?: XOR<InvoiceRevisionCreateWithoutAuthorInput, InvoiceRevisionUncheckedCreateWithoutAuthorInput> | InvoiceRevisionCreateWithoutAuthorInput[] | InvoiceRevisionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutAuthorInput | InvoiceRevisionCreateOrConnectWithoutAuthorInput[]
    createMany?: InvoiceRevisionCreateManyAuthorInputEnvelope
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
  }

  export type InvoiceRevisionUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<InvoiceRevisionCreateWithoutAuthorInput, InvoiceRevisionUncheckedCreateWithoutAuthorInput> | InvoiceRevisionCreateWithoutAuthorInput[] | InvoiceRevisionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutAuthorInput | InvoiceRevisionCreateOrConnectWithoutAuthorInput[]
    createMany?: InvoiceRevisionCreateManyAuthorInputEnvelope
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type InvoiceRevisionUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<InvoiceRevisionCreateWithoutAuthorInput, InvoiceRevisionUncheckedCreateWithoutAuthorInput> | InvoiceRevisionCreateWithoutAuthorInput[] | InvoiceRevisionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutAuthorInput | InvoiceRevisionCreateOrConnectWithoutAuthorInput[]
    upsert?: InvoiceRevisionUpsertWithWhereUniqueWithoutAuthorInput | InvoiceRevisionUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: InvoiceRevisionCreateManyAuthorInputEnvelope
    set?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    disconnect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    delete?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    update?: InvoiceRevisionUpdateWithWhereUniqueWithoutAuthorInput | InvoiceRevisionUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: InvoiceRevisionUpdateManyWithWhereWithoutAuthorInput | InvoiceRevisionUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: InvoiceRevisionScalarWhereInput | InvoiceRevisionScalarWhereInput[]
  }

  export type InvoiceRevisionUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<InvoiceRevisionCreateWithoutAuthorInput, InvoiceRevisionUncheckedCreateWithoutAuthorInput> | InvoiceRevisionCreateWithoutAuthorInput[] | InvoiceRevisionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutAuthorInput | InvoiceRevisionCreateOrConnectWithoutAuthorInput[]
    upsert?: InvoiceRevisionUpsertWithWhereUniqueWithoutAuthorInput | InvoiceRevisionUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: InvoiceRevisionCreateManyAuthorInputEnvelope
    set?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    disconnect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    delete?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    update?: InvoiceRevisionUpdateWithWhereUniqueWithoutAuthorInput | InvoiceRevisionUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: InvoiceRevisionUpdateManyWithWhereWithoutAuthorInput | InvoiceRevisionUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: InvoiceRevisionScalarWhereInput | InvoiceRevisionScalarWhereInput[]
  }

  export type CustomerPriceCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerPriceCreateWithoutCustomerInput, CustomerPriceUncheckedCreateWithoutCustomerInput> | CustomerPriceCreateWithoutCustomerInput[] | CustomerPriceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutCustomerInput | CustomerPriceCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerPriceCreateManyCustomerInputEnvelope
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
  }

  export type DraftCreateNestedManyWithoutCustomerInput = {
    create?: XOR<DraftCreateWithoutCustomerInput, DraftUncheckedCreateWithoutCustomerInput> | DraftCreateWithoutCustomerInput[] | DraftUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DraftCreateOrConnectWithoutCustomerInput | DraftCreateOrConnectWithoutCustomerInput[]
    createMany?: DraftCreateManyCustomerInputEnvelope
    connect?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
  }

  export type CustomerPriceUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<CustomerPriceCreateWithoutCustomerInput, CustomerPriceUncheckedCreateWithoutCustomerInput> | CustomerPriceCreateWithoutCustomerInput[] | CustomerPriceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutCustomerInput | CustomerPriceCreateOrConnectWithoutCustomerInput[]
    createMany?: CustomerPriceCreateManyCustomerInputEnvelope
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
  }

  export type DraftUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<DraftCreateWithoutCustomerInput, DraftUncheckedCreateWithoutCustomerInput> | DraftCreateWithoutCustomerInput[] | DraftUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DraftCreateOrConnectWithoutCustomerInput | DraftCreateOrConnectWithoutCustomerInput[]
    createMany?: DraftCreateManyCustomerInputEnvelope
    connect?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type CustomerPriceUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerPriceCreateWithoutCustomerInput, CustomerPriceUncheckedCreateWithoutCustomerInput> | CustomerPriceCreateWithoutCustomerInput[] | CustomerPriceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutCustomerInput | CustomerPriceCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerPriceUpsertWithWhereUniqueWithoutCustomerInput | CustomerPriceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerPriceCreateManyCustomerInputEnvelope
    set?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    disconnect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    delete?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    update?: CustomerPriceUpdateWithWhereUniqueWithoutCustomerInput | CustomerPriceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerPriceUpdateManyWithWhereWithoutCustomerInput | CustomerPriceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerPriceScalarWhereInput | CustomerPriceScalarWhereInput[]
  }

  export type DraftUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<DraftCreateWithoutCustomerInput, DraftUncheckedCreateWithoutCustomerInput> | DraftCreateWithoutCustomerInput[] | DraftUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DraftCreateOrConnectWithoutCustomerInput | DraftCreateOrConnectWithoutCustomerInput[]
    upsert?: DraftUpsertWithWhereUniqueWithoutCustomerInput | DraftUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: DraftCreateManyCustomerInputEnvelope
    set?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    disconnect?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    delete?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    connect?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    update?: DraftUpdateWithWhereUniqueWithoutCustomerInput | DraftUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: DraftUpdateManyWithWhereWithoutCustomerInput | DraftUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: DraftScalarWhereInput | DraftScalarWhereInput[]
  }

  export type CustomerPriceUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<CustomerPriceCreateWithoutCustomerInput, CustomerPriceUncheckedCreateWithoutCustomerInput> | CustomerPriceCreateWithoutCustomerInput[] | CustomerPriceUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutCustomerInput | CustomerPriceCreateOrConnectWithoutCustomerInput[]
    upsert?: CustomerPriceUpsertWithWhereUniqueWithoutCustomerInput | CustomerPriceUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: CustomerPriceCreateManyCustomerInputEnvelope
    set?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    disconnect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    delete?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    update?: CustomerPriceUpdateWithWhereUniqueWithoutCustomerInput | CustomerPriceUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: CustomerPriceUpdateManyWithWhereWithoutCustomerInput | CustomerPriceUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: CustomerPriceScalarWhereInput | CustomerPriceScalarWhereInput[]
  }

  export type DraftUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<DraftCreateWithoutCustomerInput, DraftUncheckedCreateWithoutCustomerInput> | DraftCreateWithoutCustomerInput[] | DraftUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: DraftCreateOrConnectWithoutCustomerInput | DraftCreateOrConnectWithoutCustomerInput[]
    upsert?: DraftUpsertWithWhereUniqueWithoutCustomerInput | DraftUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: DraftCreateManyCustomerInputEnvelope
    set?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    disconnect?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    delete?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    connect?: DraftWhereUniqueInput | DraftWhereUniqueInput[]
    update?: DraftUpdateWithWhereUniqueWithoutCustomerInput | DraftUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: DraftUpdateManyWithWhereWithoutCustomerInput | DraftUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: DraftScalarWhereInput | DraftScalarWhereInput[]
  }

  export type ProductAliasCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductAliasCreateWithoutProductInput, ProductAliasUncheckedCreateWithoutProductInput> | ProductAliasCreateWithoutProductInput[] | ProductAliasUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductAliasCreateOrConnectWithoutProductInput | ProductAliasCreateOrConnectWithoutProductInput[]
    createMany?: ProductAliasCreateManyProductInputEnvelope
    connect?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
  }

  export type CustomerPriceCreateNestedManyWithoutProductInput = {
    create?: XOR<CustomerPriceCreateWithoutProductInput, CustomerPriceUncheckedCreateWithoutProductInput> | CustomerPriceCreateWithoutProductInput[] | CustomerPriceUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutProductInput | CustomerPriceCreateOrConnectWithoutProductInput[]
    createMany?: CustomerPriceCreateManyProductInputEnvelope
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
  }

  export type DraftLineCreateNestedManyWithoutProductInput = {
    create?: XOR<DraftLineCreateWithoutProductInput, DraftLineUncheckedCreateWithoutProductInput> | DraftLineCreateWithoutProductInput[] | DraftLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutProductInput | DraftLineCreateOrConnectWithoutProductInput[]
    createMany?: DraftLineCreateManyProductInputEnvelope
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
  }

  export type ProductAliasUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductAliasCreateWithoutProductInput, ProductAliasUncheckedCreateWithoutProductInput> | ProductAliasCreateWithoutProductInput[] | ProductAliasUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductAliasCreateOrConnectWithoutProductInput | ProductAliasCreateOrConnectWithoutProductInput[]
    createMany?: ProductAliasCreateManyProductInputEnvelope
    connect?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
  }

  export type CustomerPriceUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<CustomerPriceCreateWithoutProductInput, CustomerPriceUncheckedCreateWithoutProductInput> | CustomerPriceCreateWithoutProductInput[] | CustomerPriceUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutProductInput | CustomerPriceCreateOrConnectWithoutProductInput[]
    createMany?: CustomerPriceCreateManyProductInputEnvelope
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
  }

  export type DraftLineUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<DraftLineCreateWithoutProductInput, DraftLineUncheckedCreateWithoutProductInput> | DraftLineCreateWithoutProductInput[] | DraftLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutProductInput | DraftLineCreateOrConnectWithoutProductInput[]
    createMany?: DraftLineCreateManyProductInputEnvelope
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProductAliasUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductAliasCreateWithoutProductInput, ProductAliasUncheckedCreateWithoutProductInput> | ProductAliasCreateWithoutProductInput[] | ProductAliasUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductAliasCreateOrConnectWithoutProductInput | ProductAliasCreateOrConnectWithoutProductInput[]
    upsert?: ProductAliasUpsertWithWhereUniqueWithoutProductInput | ProductAliasUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductAliasCreateManyProductInputEnvelope
    set?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    disconnect?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    delete?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    connect?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    update?: ProductAliasUpdateWithWhereUniqueWithoutProductInput | ProductAliasUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductAliasUpdateManyWithWhereWithoutProductInput | ProductAliasUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductAliasScalarWhereInput | ProductAliasScalarWhereInput[]
  }

  export type CustomerPriceUpdateManyWithoutProductNestedInput = {
    create?: XOR<CustomerPriceCreateWithoutProductInput, CustomerPriceUncheckedCreateWithoutProductInput> | CustomerPriceCreateWithoutProductInput[] | CustomerPriceUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutProductInput | CustomerPriceCreateOrConnectWithoutProductInput[]
    upsert?: CustomerPriceUpsertWithWhereUniqueWithoutProductInput | CustomerPriceUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: CustomerPriceCreateManyProductInputEnvelope
    set?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    disconnect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    delete?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    update?: CustomerPriceUpdateWithWhereUniqueWithoutProductInput | CustomerPriceUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: CustomerPriceUpdateManyWithWhereWithoutProductInput | CustomerPriceUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: CustomerPriceScalarWhereInput | CustomerPriceScalarWhereInput[]
  }

  export type DraftLineUpdateManyWithoutProductNestedInput = {
    create?: XOR<DraftLineCreateWithoutProductInput, DraftLineUncheckedCreateWithoutProductInput> | DraftLineCreateWithoutProductInput[] | DraftLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutProductInput | DraftLineCreateOrConnectWithoutProductInput[]
    upsert?: DraftLineUpsertWithWhereUniqueWithoutProductInput | DraftLineUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: DraftLineCreateManyProductInputEnvelope
    set?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    disconnect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    delete?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    update?: DraftLineUpdateWithWhereUniqueWithoutProductInput | DraftLineUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: DraftLineUpdateManyWithWhereWithoutProductInput | DraftLineUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: DraftLineScalarWhereInput | DraftLineScalarWhereInput[]
  }

  export type ProductAliasUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductAliasCreateWithoutProductInput, ProductAliasUncheckedCreateWithoutProductInput> | ProductAliasCreateWithoutProductInput[] | ProductAliasUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductAliasCreateOrConnectWithoutProductInput | ProductAliasCreateOrConnectWithoutProductInput[]
    upsert?: ProductAliasUpsertWithWhereUniqueWithoutProductInput | ProductAliasUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductAliasCreateManyProductInputEnvelope
    set?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    disconnect?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    delete?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    connect?: ProductAliasWhereUniqueInput | ProductAliasWhereUniqueInput[]
    update?: ProductAliasUpdateWithWhereUniqueWithoutProductInput | ProductAliasUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductAliasUpdateManyWithWhereWithoutProductInput | ProductAliasUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductAliasScalarWhereInput | ProductAliasScalarWhereInput[]
  }

  export type CustomerPriceUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<CustomerPriceCreateWithoutProductInput, CustomerPriceUncheckedCreateWithoutProductInput> | CustomerPriceCreateWithoutProductInput[] | CustomerPriceUncheckedCreateWithoutProductInput[]
    connectOrCreate?: CustomerPriceCreateOrConnectWithoutProductInput | CustomerPriceCreateOrConnectWithoutProductInput[]
    upsert?: CustomerPriceUpsertWithWhereUniqueWithoutProductInput | CustomerPriceUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: CustomerPriceCreateManyProductInputEnvelope
    set?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    disconnect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    delete?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    connect?: CustomerPriceWhereUniqueInput | CustomerPriceWhereUniqueInput[]
    update?: CustomerPriceUpdateWithWhereUniqueWithoutProductInput | CustomerPriceUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: CustomerPriceUpdateManyWithWhereWithoutProductInput | CustomerPriceUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: CustomerPriceScalarWhereInput | CustomerPriceScalarWhereInput[]
  }

  export type DraftLineUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<DraftLineCreateWithoutProductInput, DraftLineUncheckedCreateWithoutProductInput> | DraftLineCreateWithoutProductInput[] | DraftLineUncheckedCreateWithoutProductInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutProductInput | DraftLineCreateOrConnectWithoutProductInput[]
    upsert?: DraftLineUpsertWithWhereUniqueWithoutProductInput | DraftLineUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: DraftLineCreateManyProductInputEnvelope
    set?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    disconnect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    delete?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    update?: DraftLineUpdateWithWhereUniqueWithoutProductInput | DraftLineUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: DraftLineUpdateManyWithWhereWithoutProductInput | DraftLineUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: DraftLineScalarWhereInput | DraftLineScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutAliasesInput = {
    create?: XOR<ProductCreateWithoutAliasesInput, ProductUncheckedCreateWithoutAliasesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutAliasesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutAliasesNestedInput = {
    create?: XOR<ProductCreateWithoutAliasesInput, ProductUncheckedCreateWithoutAliasesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutAliasesInput
    upsert?: ProductUpsertWithoutAliasesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutAliasesInput, ProductUpdateWithoutAliasesInput>, ProductUncheckedUpdateWithoutAliasesInput>
  }

  export type CustomerCreateNestedOneWithoutCustomerPriceInput = {
    create?: XOR<CustomerCreateWithoutCustomerPriceInput, CustomerUncheckedCreateWithoutCustomerPriceInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCustomerPriceInput
    connect?: CustomerWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutCustomerPriceInput = {
    create?: XOR<ProductCreateWithoutCustomerPriceInput, ProductUncheckedCreateWithoutCustomerPriceInput>
    connectOrCreate?: ProductCreateOrConnectWithoutCustomerPriceInput
    connect?: ProductWhereUniqueInput
  }

  export type CustomerUpdateOneRequiredWithoutCustomerPriceNestedInput = {
    create?: XOR<CustomerCreateWithoutCustomerPriceInput, CustomerUncheckedCreateWithoutCustomerPriceInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutCustomerPriceInput
    upsert?: CustomerUpsertWithoutCustomerPriceInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutCustomerPriceInput, CustomerUpdateWithoutCustomerPriceInput>, CustomerUncheckedUpdateWithoutCustomerPriceInput>
  }

  export type ProductUpdateOneRequiredWithoutCustomerPriceNestedInput = {
    create?: XOR<ProductCreateWithoutCustomerPriceInput, ProductUncheckedCreateWithoutCustomerPriceInput>
    connectOrCreate?: ProductCreateOrConnectWithoutCustomerPriceInput
    upsert?: ProductUpsertWithoutCustomerPriceInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutCustomerPriceInput, ProductUpdateWithoutCustomerPriceInput>, ProductUncheckedUpdateWithoutCustomerPriceInput>
  }

  export type CustomerCreateNestedOneWithoutDraftsInput = {
    create?: XOR<CustomerCreateWithoutDraftsInput, CustomerUncheckedCreateWithoutDraftsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutDraftsInput
    connect?: CustomerWhereUniqueInput
  }

  export type DraftLineCreateNestedManyWithoutDraftInput = {
    create?: XOR<DraftLineCreateWithoutDraftInput, DraftLineUncheckedCreateWithoutDraftInput> | DraftLineCreateWithoutDraftInput[] | DraftLineUncheckedCreateWithoutDraftInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutDraftInput | DraftLineCreateOrConnectWithoutDraftInput[]
    createMany?: DraftLineCreateManyDraftInputEnvelope
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
  }

  export type InvoiceRevisionCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceRevisionCreateWithoutInvoiceInput, InvoiceRevisionUncheckedCreateWithoutInvoiceInput> | InvoiceRevisionCreateWithoutInvoiceInput[] | InvoiceRevisionUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutInvoiceInput | InvoiceRevisionCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceRevisionCreateManyInvoiceInputEnvelope
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
  }

  export type DraftLineUncheckedCreateNestedManyWithoutDraftInput = {
    create?: XOR<DraftLineCreateWithoutDraftInput, DraftLineUncheckedCreateWithoutDraftInput> | DraftLineCreateWithoutDraftInput[] | DraftLineUncheckedCreateWithoutDraftInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutDraftInput | DraftLineCreateOrConnectWithoutDraftInput[]
    createMany?: DraftLineCreateManyDraftInputEnvelope
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
  }

  export type InvoiceRevisionUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceRevisionCreateWithoutInvoiceInput, InvoiceRevisionUncheckedCreateWithoutInvoiceInput> | InvoiceRevisionCreateWithoutInvoiceInput[] | InvoiceRevisionUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutInvoiceInput | InvoiceRevisionCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceRevisionCreateManyInvoiceInputEnvelope
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CustomerUpdateOneRequiredWithoutDraftsNestedInput = {
    create?: XOR<CustomerCreateWithoutDraftsInput, CustomerUncheckedCreateWithoutDraftsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutDraftsInput
    upsert?: CustomerUpsertWithoutDraftsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutDraftsInput, CustomerUpdateWithoutDraftsInput>, CustomerUncheckedUpdateWithoutDraftsInput>
  }

  export type DraftLineUpdateManyWithoutDraftNestedInput = {
    create?: XOR<DraftLineCreateWithoutDraftInput, DraftLineUncheckedCreateWithoutDraftInput> | DraftLineCreateWithoutDraftInput[] | DraftLineUncheckedCreateWithoutDraftInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutDraftInput | DraftLineCreateOrConnectWithoutDraftInput[]
    upsert?: DraftLineUpsertWithWhereUniqueWithoutDraftInput | DraftLineUpsertWithWhereUniqueWithoutDraftInput[]
    createMany?: DraftLineCreateManyDraftInputEnvelope
    set?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    disconnect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    delete?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    update?: DraftLineUpdateWithWhereUniqueWithoutDraftInput | DraftLineUpdateWithWhereUniqueWithoutDraftInput[]
    updateMany?: DraftLineUpdateManyWithWhereWithoutDraftInput | DraftLineUpdateManyWithWhereWithoutDraftInput[]
    deleteMany?: DraftLineScalarWhereInput | DraftLineScalarWhereInput[]
  }

  export type InvoiceRevisionUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceRevisionCreateWithoutInvoiceInput, InvoiceRevisionUncheckedCreateWithoutInvoiceInput> | InvoiceRevisionCreateWithoutInvoiceInput[] | InvoiceRevisionUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutInvoiceInput | InvoiceRevisionCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceRevisionUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceRevisionUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceRevisionCreateManyInvoiceInputEnvelope
    set?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    disconnect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    delete?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    update?: InvoiceRevisionUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceRevisionUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceRevisionUpdateManyWithWhereWithoutInvoiceInput | InvoiceRevisionUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceRevisionScalarWhereInput | InvoiceRevisionScalarWhereInput[]
  }

  export type DraftLineUncheckedUpdateManyWithoutDraftNestedInput = {
    create?: XOR<DraftLineCreateWithoutDraftInput, DraftLineUncheckedCreateWithoutDraftInput> | DraftLineCreateWithoutDraftInput[] | DraftLineUncheckedCreateWithoutDraftInput[]
    connectOrCreate?: DraftLineCreateOrConnectWithoutDraftInput | DraftLineCreateOrConnectWithoutDraftInput[]
    upsert?: DraftLineUpsertWithWhereUniqueWithoutDraftInput | DraftLineUpsertWithWhereUniqueWithoutDraftInput[]
    createMany?: DraftLineCreateManyDraftInputEnvelope
    set?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    disconnect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    delete?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    connect?: DraftLineWhereUniqueInput | DraftLineWhereUniqueInput[]
    update?: DraftLineUpdateWithWhereUniqueWithoutDraftInput | DraftLineUpdateWithWhereUniqueWithoutDraftInput[]
    updateMany?: DraftLineUpdateManyWithWhereWithoutDraftInput | DraftLineUpdateManyWithWhereWithoutDraftInput[]
    deleteMany?: DraftLineScalarWhereInput | DraftLineScalarWhereInput[]
  }

  export type InvoiceRevisionUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceRevisionCreateWithoutInvoiceInput, InvoiceRevisionUncheckedCreateWithoutInvoiceInput> | InvoiceRevisionCreateWithoutInvoiceInput[] | InvoiceRevisionUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceRevisionCreateOrConnectWithoutInvoiceInput | InvoiceRevisionCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceRevisionUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceRevisionUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceRevisionCreateManyInvoiceInputEnvelope
    set?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    disconnect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    delete?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    connect?: InvoiceRevisionWhereUniqueInput | InvoiceRevisionWhereUniqueInput[]
    update?: InvoiceRevisionUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceRevisionUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceRevisionUpdateManyWithWhereWithoutInvoiceInput | InvoiceRevisionUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceRevisionScalarWhereInput | InvoiceRevisionScalarWhereInput[]
  }

  export type DraftCreateNestedOneWithoutLinesInput = {
    create?: XOR<DraftCreateWithoutLinesInput, DraftUncheckedCreateWithoutLinesInput>
    connectOrCreate?: DraftCreateOrConnectWithoutLinesInput
    connect?: DraftWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutDraftLinesInput = {
    create?: XOR<ProductCreateWithoutDraftLinesInput, ProductUncheckedCreateWithoutDraftLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutDraftLinesInput
    connect?: ProductWhereUniqueInput
  }

  export type DraftUpdateOneRequiredWithoutLinesNestedInput = {
    create?: XOR<DraftCreateWithoutLinesInput, DraftUncheckedCreateWithoutLinesInput>
    connectOrCreate?: DraftCreateOrConnectWithoutLinesInput
    upsert?: DraftUpsertWithoutLinesInput
    connect?: DraftWhereUniqueInput
    update?: XOR<XOR<DraftUpdateToOneWithWhereWithoutLinesInput, DraftUpdateWithoutLinesInput>, DraftUncheckedUpdateWithoutLinesInput>
  }

  export type ProductUpdateOneRequiredWithoutDraftLinesNestedInput = {
    create?: XOR<ProductCreateWithoutDraftLinesInput, ProductUncheckedCreateWithoutDraftLinesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutDraftLinesInput
    upsert?: ProductUpsertWithoutDraftLinesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutDraftLinesInput, ProductUpdateWithoutDraftLinesInput>, ProductUncheckedUpdateWithoutDraftLinesInput>
  }

  export type DraftCreateNestedOneWithoutRevisionsInput = {
    create?: XOR<DraftCreateWithoutRevisionsInput, DraftUncheckedCreateWithoutRevisionsInput>
    connectOrCreate?: DraftCreateOrConnectWithoutRevisionsInput
    connect?: DraftWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutInvoiceRevisionsInput = {
    create?: XOR<UserCreateWithoutInvoiceRevisionsInput, UserUncheckedCreateWithoutInvoiceRevisionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoiceRevisionsInput
    connect?: UserWhereUniqueInput
  }

  export type DraftUpdateOneRequiredWithoutRevisionsNestedInput = {
    create?: XOR<DraftCreateWithoutRevisionsInput, DraftUncheckedCreateWithoutRevisionsInput>
    connectOrCreate?: DraftCreateOrConnectWithoutRevisionsInput
    upsert?: DraftUpsertWithoutRevisionsInput
    connect?: DraftWhereUniqueInput
    update?: XOR<XOR<DraftUpdateToOneWithWhereWithoutRevisionsInput, DraftUpdateWithoutRevisionsInput>, DraftUncheckedUpdateWithoutRevisionsInput>
  }

  export type UserUpdateOneWithoutInvoiceRevisionsNestedInput = {
    create?: XOR<UserCreateWithoutInvoiceRevisionsInput, UserUncheckedCreateWithoutInvoiceRevisionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutInvoiceRevisionsInput
    upsert?: UserUpsertWithoutInvoiceRevisionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInvoiceRevisionsInput, UserUpdateWithoutInvoiceRevisionsInput>, UserUncheckedUpdateWithoutInvoiceRevisionsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type InvoiceRevisionCreateWithoutAuthorInput = {
    id: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
    invoice: DraftCreateNestedOneWithoutRevisionsInput
  }

  export type InvoiceRevisionUncheckedCreateWithoutAuthorInput = {
    id: number
    invoiceId: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type InvoiceRevisionCreateOrConnectWithoutAuthorInput = {
    where: InvoiceRevisionWhereUniqueInput
    create: XOR<InvoiceRevisionCreateWithoutAuthorInput, InvoiceRevisionUncheckedCreateWithoutAuthorInput>
  }

  export type InvoiceRevisionCreateManyAuthorInputEnvelope = {
    data: InvoiceRevisionCreateManyAuthorInput | InvoiceRevisionCreateManyAuthorInput[]
  }

  export type InvoiceRevisionUpsertWithWhereUniqueWithoutAuthorInput = {
    where: InvoiceRevisionWhereUniqueInput
    update: XOR<InvoiceRevisionUpdateWithoutAuthorInput, InvoiceRevisionUncheckedUpdateWithoutAuthorInput>
    create: XOR<InvoiceRevisionCreateWithoutAuthorInput, InvoiceRevisionUncheckedCreateWithoutAuthorInput>
  }

  export type InvoiceRevisionUpdateWithWhereUniqueWithoutAuthorInput = {
    where: InvoiceRevisionWhereUniqueInput
    data: XOR<InvoiceRevisionUpdateWithoutAuthorInput, InvoiceRevisionUncheckedUpdateWithoutAuthorInput>
  }

  export type InvoiceRevisionUpdateManyWithWhereWithoutAuthorInput = {
    where: InvoiceRevisionScalarWhereInput
    data: XOR<InvoiceRevisionUpdateManyMutationInput, InvoiceRevisionUncheckedUpdateManyWithoutAuthorInput>
  }

  export type InvoiceRevisionScalarWhereInput = {
    AND?: InvoiceRevisionScalarWhereInput | InvoiceRevisionScalarWhereInput[]
    OR?: InvoiceRevisionScalarWhereInput[]
    NOT?: InvoiceRevisionScalarWhereInput | InvoiceRevisionScalarWhereInput[]
    id?: IntFilter<"InvoiceRevision"> | number
    invoiceId?: IntFilter<"InvoiceRevision"> | number
    payloadJson?: StringFilter<"InvoiceRevision"> | string
    createdAt?: DateTimeFilter<"InvoiceRevision"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceRevision"> | Date | string
    createdBy?: IntNullableFilter<"InvoiceRevision"> | number | null
  }

  export type CustomerPriceCreateWithoutCustomerInput = {
    id: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
    product: ProductCreateNestedOneWithoutCustomerPriceInput
  }

  export type CustomerPriceUncheckedCreateWithoutCustomerInput = {
    id: number
    productId: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type CustomerPriceCreateOrConnectWithoutCustomerInput = {
    where: CustomerPriceWhereUniqueInput
    create: XOR<CustomerPriceCreateWithoutCustomerInput, CustomerPriceUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerPriceCreateManyCustomerInputEnvelope = {
    data: CustomerPriceCreateManyCustomerInput | CustomerPriceCreateManyCustomerInput[]
  }

  export type DraftCreateWithoutCustomerInput = {
    id: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    lines?: DraftLineCreateNestedManyWithoutDraftInput
    revisions?: InvoiceRevisionCreateNestedManyWithoutInvoiceInput
  }

  export type DraftUncheckedCreateWithoutCustomerInput = {
    id: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    lines?: DraftLineUncheckedCreateNestedManyWithoutDraftInput
    revisions?: InvoiceRevisionUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type DraftCreateOrConnectWithoutCustomerInput = {
    where: DraftWhereUniqueInput
    create: XOR<DraftCreateWithoutCustomerInput, DraftUncheckedCreateWithoutCustomerInput>
  }

  export type DraftCreateManyCustomerInputEnvelope = {
    data: DraftCreateManyCustomerInput | DraftCreateManyCustomerInput[]
  }

  export type CustomerPriceUpsertWithWhereUniqueWithoutCustomerInput = {
    where: CustomerPriceWhereUniqueInput
    update: XOR<CustomerPriceUpdateWithoutCustomerInput, CustomerPriceUncheckedUpdateWithoutCustomerInput>
    create: XOR<CustomerPriceCreateWithoutCustomerInput, CustomerPriceUncheckedCreateWithoutCustomerInput>
  }

  export type CustomerPriceUpdateWithWhereUniqueWithoutCustomerInput = {
    where: CustomerPriceWhereUniqueInput
    data: XOR<CustomerPriceUpdateWithoutCustomerInput, CustomerPriceUncheckedUpdateWithoutCustomerInput>
  }

  export type CustomerPriceUpdateManyWithWhereWithoutCustomerInput = {
    where: CustomerPriceScalarWhereInput
    data: XOR<CustomerPriceUpdateManyMutationInput, CustomerPriceUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CustomerPriceScalarWhereInput = {
    AND?: CustomerPriceScalarWhereInput | CustomerPriceScalarWhereInput[]
    OR?: CustomerPriceScalarWhereInput[]
    NOT?: CustomerPriceScalarWhereInput | CustomerPriceScalarWhereInput[]
    id?: IntFilter<"CustomerPrice"> | number
    customerId?: IntFilter<"CustomerPrice"> | number
    productId?: IntFilter<"CustomerPrice"> | number
    priceCents?: IntFilter<"CustomerPrice"> | number
    createdAt?: DateTimeFilter<"CustomerPrice"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerPrice"> | Date | string
  }

  export type DraftUpsertWithWhereUniqueWithoutCustomerInput = {
    where: DraftWhereUniqueInput
    update: XOR<DraftUpdateWithoutCustomerInput, DraftUncheckedUpdateWithoutCustomerInput>
    create: XOR<DraftCreateWithoutCustomerInput, DraftUncheckedCreateWithoutCustomerInput>
  }

  export type DraftUpdateWithWhereUniqueWithoutCustomerInput = {
    where: DraftWhereUniqueInput
    data: XOR<DraftUpdateWithoutCustomerInput, DraftUncheckedUpdateWithoutCustomerInput>
  }

  export type DraftUpdateManyWithWhereWithoutCustomerInput = {
    where: DraftScalarWhereInput
    data: XOR<DraftUpdateManyMutationInput, DraftUncheckedUpdateManyWithoutCustomerInput>
  }

  export type DraftScalarWhereInput = {
    AND?: DraftScalarWhereInput | DraftScalarWhereInput[]
    OR?: DraftScalarWhereInput[]
    NOT?: DraftScalarWhereInput | DraftScalarWhereInput[]
    id?: IntFilter<"Draft"> | number
    customerId?: IntFilter<"Draft"> | number
    date?: DateTimeFilter<"Draft"> | Date | string
    note?: StringNullableFilter<"Draft"> | string | null
    includeLicenseFee?: BoolFilter<"Draft"> | boolean
    paymentMethod?: StringFilter<"Draft"> | string
    tourClosedAt?: DateTimeNullableFilter<"Draft"> | Date | string | null
    createdAt?: DateTimeFilter<"Draft"> | Date | string
    updatedAt?: DateTimeFilter<"Draft"> | Date | string
  }

  export type ProductAliasCreateWithoutProductInput = {
    id: number
    alias: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type ProductAliasUncheckedCreateWithoutProductInput = {
    id: number
    alias: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type ProductAliasCreateOrConnectWithoutProductInput = {
    where: ProductAliasWhereUniqueInput
    create: XOR<ProductAliasCreateWithoutProductInput, ProductAliasUncheckedCreateWithoutProductInput>
  }

  export type ProductAliasCreateManyProductInputEnvelope = {
    data: ProductAliasCreateManyProductInput | ProductAliasCreateManyProductInput[]
  }

  export type CustomerPriceCreateWithoutProductInput = {
    id: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
    customer: CustomerCreateNestedOneWithoutCustomerPriceInput
  }

  export type CustomerPriceUncheckedCreateWithoutProductInput = {
    id: number
    customerId: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type CustomerPriceCreateOrConnectWithoutProductInput = {
    where: CustomerPriceWhereUniqueInput
    create: XOR<CustomerPriceCreateWithoutProductInput, CustomerPriceUncheckedCreateWithoutProductInput>
  }

  export type CustomerPriceCreateManyProductInputEnvelope = {
    data: CustomerPriceCreateManyProductInput | CustomerPriceCreateManyProductInput[]
  }

  export type DraftLineCreateWithoutProductInput = {
    id: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
    draft: DraftCreateNestedOneWithoutLinesInput
  }

  export type DraftLineUncheckedCreateWithoutProductInput = {
    id: number
    draftId: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type DraftLineCreateOrConnectWithoutProductInput = {
    where: DraftLineWhereUniqueInput
    create: XOR<DraftLineCreateWithoutProductInput, DraftLineUncheckedCreateWithoutProductInput>
  }

  export type DraftLineCreateManyProductInputEnvelope = {
    data: DraftLineCreateManyProductInput | DraftLineCreateManyProductInput[]
  }

  export type ProductAliasUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductAliasWhereUniqueInput
    update: XOR<ProductAliasUpdateWithoutProductInput, ProductAliasUncheckedUpdateWithoutProductInput>
    create: XOR<ProductAliasCreateWithoutProductInput, ProductAliasUncheckedCreateWithoutProductInput>
  }

  export type ProductAliasUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductAliasWhereUniqueInput
    data: XOR<ProductAliasUpdateWithoutProductInput, ProductAliasUncheckedUpdateWithoutProductInput>
  }

  export type ProductAliasUpdateManyWithWhereWithoutProductInput = {
    where: ProductAliasScalarWhereInput
    data: XOR<ProductAliasUpdateManyMutationInput, ProductAliasUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductAliasScalarWhereInput = {
    AND?: ProductAliasScalarWhereInput | ProductAliasScalarWhereInput[]
    OR?: ProductAliasScalarWhereInput[]
    NOT?: ProductAliasScalarWhereInput | ProductAliasScalarWhereInput[]
    id?: IntFilter<"ProductAlias"> | number
    productId?: IntFilter<"ProductAlias"> | number
    alias?: StringFilter<"ProductAlias"> | string
    createdAt?: DateTimeFilter<"ProductAlias"> | Date | string
    updatedAt?: DateTimeFilter<"ProductAlias"> | Date | string
  }

  export type CustomerPriceUpsertWithWhereUniqueWithoutProductInput = {
    where: CustomerPriceWhereUniqueInput
    update: XOR<CustomerPriceUpdateWithoutProductInput, CustomerPriceUncheckedUpdateWithoutProductInput>
    create: XOR<CustomerPriceCreateWithoutProductInput, CustomerPriceUncheckedCreateWithoutProductInput>
  }

  export type CustomerPriceUpdateWithWhereUniqueWithoutProductInput = {
    where: CustomerPriceWhereUniqueInput
    data: XOR<CustomerPriceUpdateWithoutProductInput, CustomerPriceUncheckedUpdateWithoutProductInput>
  }

  export type CustomerPriceUpdateManyWithWhereWithoutProductInput = {
    where: CustomerPriceScalarWhereInput
    data: XOR<CustomerPriceUpdateManyMutationInput, CustomerPriceUncheckedUpdateManyWithoutProductInput>
  }

  export type DraftLineUpsertWithWhereUniqueWithoutProductInput = {
    where: DraftLineWhereUniqueInput
    update: XOR<DraftLineUpdateWithoutProductInput, DraftLineUncheckedUpdateWithoutProductInput>
    create: XOR<DraftLineCreateWithoutProductInput, DraftLineUncheckedCreateWithoutProductInput>
  }

  export type DraftLineUpdateWithWhereUniqueWithoutProductInput = {
    where: DraftLineWhereUniqueInput
    data: XOR<DraftLineUpdateWithoutProductInput, DraftLineUncheckedUpdateWithoutProductInput>
  }

  export type DraftLineUpdateManyWithWhereWithoutProductInput = {
    where: DraftLineScalarWhereInput
    data: XOR<DraftLineUpdateManyMutationInput, DraftLineUncheckedUpdateManyWithoutProductInput>
  }

  export type DraftLineScalarWhereInput = {
    AND?: DraftLineScalarWhereInput | DraftLineScalarWhereInput[]
    OR?: DraftLineScalarWhereInput[]
    NOT?: DraftLineScalarWhereInput | DraftLineScalarWhereInput[]
    id?: IntFilter<"DraftLine"> | number
    draftId?: IntFilter<"DraftLine"> | number
    productId?: IntFilter<"DraftLine"> | number
    quantity?: IntFilter<"DraftLine"> | number
    unitPriceCents?: IntFilter<"DraftLine"> | number
    createdAt?: DateTimeFilter<"DraftLine"> | Date | string
    updatedAt?: DateTimeFilter<"DraftLine"> | Date | string
  }

  export type ProductCreateWithoutAliasesInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    customerPrice?: CustomerPriceCreateNestedManyWithoutProductInput
    draftLines?: DraftLineCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutAliasesInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    customerPrice?: CustomerPriceUncheckedCreateNestedManyWithoutProductInput
    draftLines?: DraftLineUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutAliasesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutAliasesInput, ProductUncheckedCreateWithoutAliasesInput>
  }

  export type ProductUpsertWithoutAliasesInput = {
    update: XOR<ProductUpdateWithoutAliasesInput, ProductUncheckedUpdateWithoutAliasesInput>
    create: XOR<ProductCreateWithoutAliasesInput, ProductUncheckedCreateWithoutAliasesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutAliasesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutAliasesInput, ProductUncheckedUpdateWithoutAliasesInput>
  }

  export type ProductUpdateWithoutAliasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerPrice?: CustomerPriceUpdateManyWithoutProductNestedInput
    draftLines?: DraftLineUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutAliasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerPrice?: CustomerPriceUncheckedUpdateManyWithoutProductNestedInput
    draftLines?: DraftLineUncheckedUpdateManyWithoutProductNestedInput
  }

  export type CustomerCreateWithoutCustomerPriceInput = {
    id: number
    name: string
    address?: string | null
    phone?: string | null
    routeDay?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    drafts?: DraftCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutCustomerPriceInput = {
    id: number
    name: string
    address?: string | null
    phone?: string | null
    routeDay?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    drafts?: DraftUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutCustomerPriceInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutCustomerPriceInput, CustomerUncheckedCreateWithoutCustomerPriceInput>
  }

  export type ProductCreateWithoutCustomerPriceInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    aliases?: ProductAliasCreateNestedManyWithoutProductInput
    draftLines?: DraftLineCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutCustomerPriceInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    aliases?: ProductAliasUncheckedCreateNestedManyWithoutProductInput
    draftLines?: DraftLineUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutCustomerPriceInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutCustomerPriceInput, ProductUncheckedCreateWithoutCustomerPriceInput>
  }

  export type CustomerUpsertWithoutCustomerPriceInput = {
    update: XOR<CustomerUpdateWithoutCustomerPriceInput, CustomerUncheckedUpdateWithoutCustomerPriceInput>
    create: XOR<CustomerCreateWithoutCustomerPriceInput, CustomerUncheckedCreateWithoutCustomerPriceInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutCustomerPriceInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutCustomerPriceInput, CustomerUncheckedUpdateWithoutCustomerPriceInput>
  }

  export type CustomerUpdateWithoutCustomerPriceInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drafts?: DraftUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutCustomerPriceInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    drafts?: DraftUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type ProductUpsertWithoutCustomerPriceInput = {
    update: XOR<ProductUpdateWithoutCustomerPriceInput, ProductUncheckedUpdateWithoutCustomerPriceInput>
    create: XOR<ProductCreateWithoutCustomerPriceInput, ProductUncheckedCreateWithoutCustomerPriceInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutCustomerPriceInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutCustomerPriceInput, ProductUncheckedUpdateWithoutCustomerPriceInput>
  }

  export type ProductUpdateWithoutCustomerPriceInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aliases?: ProductAliasUpdateManyWithoutProductNestedInput
    draftLines?: DraftLineUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutCustomerPriceInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aliases?: ProductAliasUncheckedUpdateManyWithoutProductNestedInput
    draftLines?: DraftLineUncheckedUpdateManyWithoutProductNestedInput
  }

  export type CustomerCreateWithoutDraftsInput = {
    id: number
    name: string
    address?: string | null
    phone?: string | null
    routeDay?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    customerPrice?: CustomerPriceCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutDraftsInput = {
    id: number
    name: string
    address?: string | null
    phone?: string | null
    routeDay?: string | null
    createdAt: Date | string
    updatedAt: Date | string
    customerPrice?: CustomerPriceUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutDraftsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutDraftsInput, CustomerUncheckedCreateWithoutDraftsInput>
  }

  export type DraftLineCreateWithoutDraftInput = {
    id: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
    product: ProductCreateNestedOneWithoutDraftLinesInput
  }

  export type DraftLineUncheckedCreateWithoutDraftInput = {
    id: number
    productId: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type DraftLineCreateOrConnectWithoutDraftInput = {
    where: DraftLineWhereUniqueInput
    create: XOR<DraftLineCreateWithoutDraftInput, DraftLineUncheckedCreateWithoutDraftInput>
  }

  export type DraftLineCreateManyDraftInputEnvelope = {
    data: DraftLineCreateManyDraftInput | DraftLineCreateManyDraftInput[]
  }

  export type InvoiceRevisionCreateWithoutInvoiceInput = {
    id: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
    author?: UserCreateNestedOneWithoutInvoiceRevisionsInput
  }

  export type InvoiceRevisionUncheckedCreateWithoutInvoiceInput = {
    id: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
    createdBy?: number | null
  }

  export type InvoiceRevisionCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceRevisionWhereUniqueInput
    create: XOR<InvoiceRevisionCreateWithoutInvoiceInput, InvoiceRevisionUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceRevisionCreateManyInvoiceInputEnvelope = {
    data: InvoiceRevisionCreateManyInvoiceInput | InvoiceRevisionCreateManyInvoiceInput[]
  }

  export type CustomerUpsertWithoutDraftsInput = {
    update: XOR<CustomerUpdateWithoutDraftsInput, CustomerUncheckedUpdateWithoutDraftsInput>
    create: XOR<CustomerCreateWithoutDraftsInput, CustomerUncheckedCreateWithoutDraftsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutDraftsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutDraftsInput, CustomerUncheckedUpdateWithoutDraftsInput>
  }

  export type CustomerUpdateWithoutDraftsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerPrice?: CustomerPriceUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutDraftsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    routeDay?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerPrice?: CustomerPriceUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type DraftLineUpsertWithWhereUniqueWithoutDraftInput = {
    where: DraftLineWhereUniqueInput
    update: XOR<DraftLineUpdateWithoutDraftInput, DraftLineUncheckedUpdateWithoutDraftInput>
    create: XOR<DraftLineCreateWithoutDraftInput, DraftLineUncheckedCreateWithoutDraftInput>
  }

  export type DraftLineUpdateWithWhereUniqueWithoutDraftInput = {
    where: DraftLineWhereUniqueInput
    data: XOR<DraftLineUpdateWithoutDraftInput, DraftLineUncheckedUpdateWithoutDraftInput>
  }

  export type DraftLineUpdateManyWithWhereWithoutDraftInput = {
    where: DraftLineScalarWhereInput
    data: XOR<DraftLineUpdateManyMutationInput, DraftLineUncheckedUpdateManyWithoutDraftInput>
  }

  export type InvoiceRevisionUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceRevisionWhereUniqueInput
    update: XOR<InvoiceRevisionUpdateWithoutInvoiceInput, InvoiceRevisionUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceRevisionCreateWithoutInvoiceInput, InvoiceRevisionUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceRevisionUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceRevisionWhereUniqueInput
    data: XOR<InvoiceRevisionUpdateWithoutInvoiceInput, InvoiceRevisionUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceRevisionUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceRevisionScalarWhereInput
    data: XOR<InvoiceRevisionUpdateManyMutationInput, InvoiceRevisionUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type DraftCreateWithoutLinesInput = {
    id: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    customer: CustomerCreateNestedOneWithoutDraftsInput
    revisions?: InvoiceRevisionCreateNestedManyWithoutInvoiceInput
  }

  export type DraftUncheckedCreateWithoutLinesInput = {
    id: number
    customerId: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    revisions?: InvoiceRevisionUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type DraftCreateOrConnectWithoutLinesInput = {
    where: DraftWhereUniqueInput
    create: XOR<DraftCreateWithoutLinesInput, DraftUncheckedCreateWithoutLinesInput>
  }

  export type ProductCreateWithoutDraftLinesInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    aliases?: ProductAliasCreateNestedManyWithoutProductInput
    customerPrice?: CustomerPriceCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutDraftLinesInput = {
    id: number
    sku: string
    name: string
    defaultPriceCents?: number | null
    licenseFeeCents: number
    licenseMaterial?: string | null
    licenseWeightGrams: number
    isActive: boolean
    createdAt: Date | string
    updatedAt: Date | string
    aliases?: ProductAliasUncheckedCreateNestedManyWithoutProductInput
    customerPrice?: CustomerPriceUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutDraftLinesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutDraftLinesInput, ProductUncheckedCreateWithoutDraftLinesInput>
  }

  export type DraftUpsertWithoutLinesInput = {
    update: XOR<DraftUpdateWithoutLinesInput, DraftUncheckedUpdateWithoutLinesInput>
    create: XOR<DraftCreateWithoutLinesInput, DraftUncheckedCreateWithoutLinesInput>
    where?: DraftWhereInput
  }

  export type DraftUpdateToOneWithWhereWithoutLinesInput = {
    where?: DraftWhereInput
    data: XOR<DraftUpdateWithoutLinesInput, DraftUncheckedUpdateWithoutLinesInput>
  }

  export type DraftUpdateWithoutLinesInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutDraftsNestedInput
    revisions?: InvoiceRevisionUpdateManyWithoutInvoiceNestedInput
  }

  export type DraftUncheckedUpdateWithoutLinesInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revisions?: InvoiceRevisionUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type ProductUpsertWithoutDraftLinesInput = {
    update: XOR<ProductUpdateWithoutDraftLinesInput, ProductUncheckedUpdateWithoutDraftLinesInput>
    create: XOR<ProductCreateWithoutDraftLinesInput, ProductUncheckedCreateWithoutDraftLinesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutDraftLinesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutDraftLinesInput, ProductUncheckedUpdateWithoutDraftLinesInput>
  }

  export type ProductUpdateWithoutDraftLinesInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aliases?: ProductAliasUpdateManyWithoutProductNestedInput
    customerPrice?: CustomerPriceUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutDraftLinesInput = {
    id?: IntFieldUpdateOperationsInput | number
    sku?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    defaultPriceCents?: NullableIntFieldUpdateOperationsInput | number | null
    licenseFeeCents?: IntFieldUpdateOperationsInput | number
    licenseMaterial?: NullableStringFieldUpdateOperationsInput | string | null
    licenseWeightGrams?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    aliases?: ProductAliasUncheckedUpdateManyWithoutProductNestedInput
    customerPrice?: CustomerPriceUncheckedUpdateManyWithoutProductNestedInput
  }

  export type DraftCreateWithoutRevisionsInput = {
    id: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    customer: CustomerCreateNestedOneWithoutDraftsInput
    lines?: DraftLineCreateNestedManyWithoutDraftInput
  }

  export type DraftUncheckedCreateWithoutRevisionsInput = {
    id: number
    customerId: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
    lines?: DraftLineUncheckedCreateNestedManyWithoutDraftInput
  }

  export type DraftCreateOrConnectWithoutRevisionsInput = {
    where: DraftWhereUniqueInput
    create: XOR<DraftCreateWithoutRevisionsInput, DraftUncheckedCreateWithoutRevisionsInput>
  }

  export type UserCreateWithoutInvoiceRevisionsInput = {
    id: number
    pinHash: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type UserUncheckedCreateWithoutInvoiceRevisionsInput = {
    id: number
    pinHash: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type UserCreateOrConnectWithoutInvoiceRevisionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInvoiceRevisionsInput, UserUncheckedCreateWithoutInvoiceRevisionsInput>
  }

  export type DraftUpsertWithoutRevisionsInput = {
    update: XOR<DraftUpdateWithoutRevisionsInput, DraftUncheckedUpdateWithoutRevisionsInput>
    create: XOR<DraftCreateWithoutRevisionsInput, DraftUncheckedCreateWithoutRevisionsInput>
    where?: DraftWhereInput
  }

  export type DraftUpdateToOneWithWhereWithoutRevisionsInput = {
    where?: DraftWhereInput
    data: XOR<DraftUpdateWithoutRevisionsInput, DraftUncheckedUpdateWithoutRevisionsInput>
  }

  export type DraftUpdateWithoutRevisionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutDraftsNestedInput
    lines?: DraftLineUpdateManyWithoutDraftNestedInput
  }

  export type DraftUncheckedUpdateWithoutRevisionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: DraftLineUncheckedUpdateManyWithoutDraftNestedInput
  }

  export type UserUpsertWithoutInvoiceRevisionsInput = {
    update: XOR<UserUpdateWithoutInvoiceRevisionsInput, UserUncheckedUpdateWithoutInvoiceRevisionsInput>
    create: XOR<UserCreateWithoutInvoiceRevisionsInput, UserUncheckedCreateWithoutInvoiceRevisionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInvoiceRevisionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInvoiceRevisionsInput, UserUncheckedUpdateWithoutInvoiceRevisionsInput>
  }

  export type UserUpdateWithoutInvoiceRevisionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    pinHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutInvoiceRevisionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    pinHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceRevisionCreateManyAuthorInput = {
    id: number
    invoiceId: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type InvoiceRevisionUpdateWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: DraftUpdateOneRequiredWithoutRevisionsNestedInput
  }

  export type InvoiceRevisionUncheckedUpdateWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceRevisionUncheckedUpdateManyWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    invoiceId?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPriceCreateManyCustomerInput = {
    id: number
    productId: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type DraftCreateManyCustomerInput = {
    id: number
    date: Date | string
    note?: string | null
    includeLicenseFee: boolean
    paymentMethod: string
    tourClosedAt?: Date | string | null
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type CustomerPriceUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutCustomerPriceNestedInput
  }

  export type CustomerPriceUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPriceUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: DraftLineUpdateManyWithoutDraftNestedInput
    revisions?: InvoiceRevisionUpdateManyWithoutInvoiceNestedInput
  }

  export type DraftUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lines?: DraftLineUncheckedUpdateManyWithoutDraftNestedInput
    revisions?: InvoiceRevisionUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type DraftUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    includeLicenseFee?: BoolFieldUpdateOperationsInput | boolean
    paymentMethod?: StringFieldUpdateOperationsInput | string
    tourClosedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAliasCreateManyProductInput = {
    id: number
    alias: string
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type CustomerPriceCreateManyProductInput = {
    id: number
    customerId: number
    priceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type DraftLineCreateManyProductInput = {
    id: number
    draftId: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type ProductAliasUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    alias?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAliasUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    alias?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductAliasUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    alias?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPriceUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutCustomerPriceNestedInput
  }

  export type CustomerPriceUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPriceUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: IntFieldUpdateOperationsInput | number
    priceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftLineUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    draft?: DraftUpdateOneRequiredWithoutLinesNestedInput
  }

  export type DraftLineUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    draftId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftLineUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    draftId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftLineCreateManyDraftInput = {
    id: number
    productId: number
    quantity: number
    unitPriceCents: number
    createdAt: Date | string
    updatedAt: Date | string
  }

  export type InvoiceRevisionCreateManyInvoiceInput = {
    id: number
    payloadJson: string
    createdAt: Date | string
    updatedAt: Date | string
    createdBy?: number | null
  }

  export type DraftLineUpdateWithoutDraftInput = {
    id?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutDraftLinesNestedInput
  }

  export type DraftLineUncheckedUpdateWithoutDraftInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DraftLineUncheckedUpdateManyWithoutDraftInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    unitPriceCents?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceRevisionUpdateWithoutInvoiceInput = {
    id?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneWithoutInvoiceRevisionsNestedInput
  }

  export type InvoiceRevisionUncheckedUpdateWithoutInvoiceInput = {
    id?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type InvoiceRevisionUncheckedUpdateManyWithoutInvoiceInput = {
    id?: IntFieldUpdateOperationsInput | number
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerCountOutputTypeDefaultArgs instead
     */
    export type CustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductCountOutputTypeDefaultArgs instead
     */
    export type ProductCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DraftCountOutputTypeDefaultArgs instead
     */
    export type DraftCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DraftCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerDefaultArgs instead
     */
    export type CustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductDefaultArgs instead
     */
    export type ProductArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProductAliasDefaultArgs instead
     */
    export type ProductAliasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProductAliasDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerPriceDefaultArgs instead
     */
    export type CustomerPriceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerPriceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DraftDefaultArgs instead
     */
    export type DraftArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DraftDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DraftLineDefaultArgs instead
     */
    export type DraftLineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DraftLineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceRevisionDefaultArgs instead
     */
    export type InvoiceRevisionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceRevisionDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}