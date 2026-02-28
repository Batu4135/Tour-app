# Nord-Pack Tour App

Next.js (App Router) + TypeScript + Prisma.

Ziel:
- 24/7 online (Vercel + Neon Postgres)
- Keine Datenverluste (Cloud + PITR + lokale 2. Kopie)
- Offline-Schutz in der iPhone-Webapp

## 1) Local Setup (Windows / VS Code)

```bash
npm install
copy .env.example .env
```

Wenn bereits eine alte `.env` aus der SQLite-Phase existiert, ersetze `DATABASE_URL` unbedingt mit einer Neon-Postgres URL.

`.env` Beispiel:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-your-neon-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://USER:PASSWORD@ep-your-neon-direct.eu-central-1.aws.neon.tech/neondb?sslmode=require"
LOCAL_DATABASE_URL="file:./local.db"
SESSION_SECRET="change-me-for-production"
APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-random-secret"
DEFAULT_ADMIN_PIN="123456"
SEED_DEMO_DATA="false"
RESET_ADMIN_PIN="false"
BACKUP_RETENTION_DAYS="30"
```

Dann:

```bash
npm run db:generate
npm run db:push:cloud
npm run db:push:local
npm run db:migrate:deploy
npm run db:seed
npm run import:products
npm run dev
```

Hinweis:
- `DATABASE_URL` = Neon Pooler URL (Runtime)
- `DIRECT_URL` = Neon Direct URL (Migrationen / `migrate deploy`)
- `npm run db:seed` ist non-destruktiv (loescht keine Daten)
- optionale Demo-Daten per `SEED_DEMO_DATA=true`

## 2) Desktop DB Verwaltung (statt Prisma Studio)

Empfohlene Tools:
- DBeaver: bester Allrounder (Postgres + SQLite in einer App)
- pgAdmin: sehr gut fuer reine PostgreSQL Admin-Aufgaben
- TablePlus: sehr schnelle, schlanke UI

### Verbindung bequem anzeigen (`db:connect`)

Script:

```bash
npm run db:connect
```

Das Script oeffnet nichts und gibt lesbar aus:
- komplette URI im Format `postgres://user:password@host:port/dbname?sslmode=require`
- Host
- Port
- Database
- User
- SSL Mode

### Neon Verbindungsdaten (Cloud Postgres)

Aus Neon Dashboard:
- Host: z. B. `ep-cool-rain-123456.eu-central-1.aws.neon.tech`
- Port: `5432`
- Database: z. B. `neondb`
- User: z. B. `neondb_owner`
- Password: dein Neon Passwort
- SSL: `require`
- Fuer Runtime mit Pooler: `pgbouncer=true&connection_limit=1`
- Fuer Migrationen: `DIRECT_URL` auf den Direct Host setzen

Beispiel URI:

```txt
postgres://neondb_owner:YOUR_PASSWORD@ep-cool-rain-123456.eu-central-1.aws.neon.tech:5432/neondb?sslmode=require
```

### pgAdmin Connect (kurz)

1. `Register > Server...`
2. `General > Name`: z. B. `Nord-Pack Neon`
3. `Connection`:
   - Host: Neon Host
   - Port: `5432`
   - Maintenance DB: deine DB (z. B. `neondb`)
   - Username: Neon User
   - Password: Neon Password
4. `SSL`:
   - SSL mode: `require`
5. Save

### DBeaver Connect (kurz)

1. `Database > New Database Connection > PostgreSQL`
2. Felder setzen:
   - Host, Port `5432`, Database, Username, Password
3. Tab `SSL`:
   - SSL mode: `require`
4. `Test Connection` > `Finish`

### TablePlus Connect (kurz)

1. `Create a new connection > PostgreSQL`
2. Felder setzen:
   - Host, Port `5432`, Database, User, Password
3. SSL aktivieren:
   - Mode `require`
4. `Test` > `Connect`

### Test-SQL nach Connect

```sql
SELECT 1;
SELECT * FROM "Product" LIMIT 50;
SELECT * FROM "Customer" LIMIT 50;
SELECT * FROM "Draft" ORDER BY "date" DESC LIMIT 20;
```

### Tabellenstruktur verstehen

Prisma legt Tabellen im `public` Schema an (PascalCase, daher oft mit Quotes arbeiten):
- `"User"` (Login/PIN Hash)
- `"Customer"` (Kundenstamm)
- `"Product"` (globale Produkte)
- `"CustomerPrice"` (kundenspezifische Preise)
- `"Draft"` (Rechnungsvordruck-Kopf)
- `"DraftLine"` (Positionen)
- `"InvoiceRevision"` (Aenderungshistorie)

Typischer Join:

```sql
SELECT d."id", c."name", d."date"
FROM "Draft" d
JOIN "Customer" c ON c."id" = d."customerId"
ORDER BY d."date" DESC
LIMIT 20;
```

### Backups direkt im Tool

- pgAdmin:
  - Rechtsklick auf DB > `Backup...`
  - Format `Plain` (SQL) oder `Custom`
- DBeaver:
  - Rechtsklick DB/Schema > `Tools` > `Backup` oder `Data Transfer`
- TablePlus:
  - `File > Export > SQL Dump`

## 3) CLI fuer Dump/Restore

### SQL Dump

```bash
npm run db:dump
```

Standardziel:
- `./backups/sql/YYYY-MM-DD/dump-<timestamp>.sql`

Eigenes Ziel:

```bash
npm run db:dump -- ./backups/sql/manual/mydump.sql
```

### SQL Restore

```bash
npm run db:restore -- ./backups/sql/2026-02-27/dump-2026-02-27T12-00-00-000Z.sql
```

Hinweise:
- benoetigt `psql` im PATH
- Restore laeuft mit `ON_ERROR_STOP=on` und `--single-transaction`

## 4) Prisma & PostgreSQL Production Notes

- Primary-DB ist PostgreSQL (`prisma/schema.prisma`), SQLite ist nur optionale lokale Spiegelung.
- Wichtige Indizes sind gesetzt:
  - `Customer.name`
  - `Product.name`
  - `Product.sku` (entspricht im Betrieb der Artikelnummer)
  - `Draft(customerId, date)`
  - `DraftLine.draftId`, `DraftLine.productId`
  - `InvoiceRevision(invoiceId, createdAt)`
- Case-insensitive Suche fuer Postgres ist aktiv (`mode: "insensitive"` in den Query-Containern fuer Produkte/Kunden).
- `build:vercel` nutzt `prisma migrate deploy` und ist fuer CI/CD ausgelegt.

## 5) Security Notes

- PIN wird ausschliesslich gehasht (bcrypt, Cost 12) gespeichert.
- PIN Policy: 6 bis 10 Ziffern (Login + PIN-Aenderung).
- `npm run db:seed` legt beim ersten Lauf einen Admin-User mit `DEFAULT_ADMIN_PIN` an.
- Login-Rate-Limiting ist vorbereitet (IP-basiert, 10 Versuche / 5 Minuten).
- Auth-Bypass via `DISABLE_AUTH=true` ist nur ausserhalb von Production aktiv.
- In Production werden `SESSION_SECRET` und `NEXTAUTH_SECRET` strikt erwartet.

## 6) Lokale SQLite Kopie in Desktop Tools

Lokale DB ist `local.db` (gesetzt ueber `LOCAL_DATABASE_URL`).

### DBeaver direkt mit `local.db` verbinden

1. `Database > New Database Connection > SQLite`
2. `Database file` auf `C:\Users\batu4\Documents\Nord-Pack\Tour-app\local.db`
3. Connect

### Export/Import Empfehlungen (SQLite <-> Postgres)

Empfohlen:
1. Cloud als Truth (`DATABASE_URL` = Neon)
2. Lokale Spiegelung ueber:
   - `npm run pull:local`
3. Fuer einzelne Tabellen:
   - CSV Export in Tool A
   - CSV Import in Tool B
4. Fuer komplette SQL Migration:
   - externe Tools wie `pgloader` nutzen

## 7) Deployment (Vercel + Neon)

### Neon
1. Neon Projekt + DB anlegen
2. Connection String kopieren (`sslmode=require`)
3. als `DATABASE_URL` setzen

### Vercel
1. Projekt importieren
2. Environment Variables setzen:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `SESSION_SECRET`
   - `NEXTAUTH_SECRET`
   - `APP_URL`
3. Build Command:
   - `npm run build:vercel`

`build:vercel` fuehrt aus:
- `prisma migrate deploy`
- `prisma generate --schema prisma/schema.prisma`
- `next build`

`prisma migrate deploy` nutzt bei gesetztem `directUrl` automatisch `DIRECT_URL`.

## 8) Health Check

Endpoint:
- `GET /api/health`

Erwartung:
- HTTP 200 bei DB OK (`SELECT 1`)

## 9) Backup + Pull Local (bestehende Data-Safety Flows)

```bash
npm run backup
npm run pull:local
```

- `backup`: JSON Export wichtiger Tabellen + Rotation (`BACKUP_RETENTION_DAYS`)
- `pull:local`: Cloud nach lokaler SQLite spiegeln

## 10) Windows Task Scheduler (Automatik)

### taeglich 02:00 Backup

```cmd
/c cd /d C:\Users\batu4\Documents\Nord-Pack\Tour-app && npm run backup
```

### alle 30 Minuten Pull-to-local

```cmd
/c cd /d C:\Users\batu4\Documents\Nord-Pack\Tour-app && npm run pull:local
```

## 11) Wichtige Commands

```bash
npm run dev
npm run import:products
npm run db:seed
npm run db:migrate:deploy
npm run db:connect
npm run db:dump
npm run db:restore -- ./path/to/dump.sql
npm run backup
npm run pull:local
```

## 12) Troubleshooting

### `DATABASE_URL ist ungueltig ... postgresql://...`

`DATABASE_URL` zeigt noch auf SQLite (`file:...`) oder ist leer.

Setzen:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
```

### `pg_dump nicht gefunden` / `psql nicht gefunden`

PostgreSQL Client Tools installieren und `PATH` aktualisieren.

### `Cannot find module ../prisma/generated/local-client`

```bash
npm run db:generate:local
```

### `prisma migrate deploy` meldet bestehende Tabellen

Wenn die DB historisch mit `db push` aufgebaut wurde (ohne Migrationshistorie), muss sie einmalig "gebaselined" werden, bevor `migrate deploy` sauber durchlaeuft.

### Health ist nicht 200

- `DATABASE_URL` pruefen
- Neon Erreichbarkeit pruefen
- Vercel Logs pruefen
