import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { computeLicenseFeeCents, normalizeLicenseMaterial, normalizeLicenseWeightGrams } from "@/lib/license";
import { z } from "zod";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    id: string;
  };
};

const updateProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(1),
  defaultPriceCents: z.number().int().min(0).nullable().optional(),
  licenseFeeCents: z.number().int().min(0).optional(),
  licenseMaterial: z.enum(["LP", "LK", "LA", "LV"]).nullable().optional(),
  licenseWeightGrams: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
});

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige Produkt-ID.");

  const parsed = updateProductSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Ungueltige Anfrage.");
  const name = parsed.data.name.trim();
  const sku = parsed.data.sku.trim();
  const licenseMaterial = normalizeLicenseMaterial(parsed.data.licenseMaterial);
  const licenseWeightGrams = licenseMaterial ? normalizeLicenseWeightGrams(parsed.data.licenseWeightGrams ?? 0) : 0;
  const computedLicenseFeeCents = computeLicenseFeeCents(licenseMaterial, licenseWeightGrams);
  const manualLicenseFeeCents =
    typeof parsed.data.licenseFeeCents === "number" && parsed.data.licenseFeeCents >= 0
      ? Math.round(parsed.data.licenseFeeCents)
      : 0;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        defaultPriceCents:
          typeof parsed.data.defaultPriceCents === "number" && parsed.data.defaultPriceCents >= 0
            ? Math.round(parsed.data.defaultPriceCents)
            : null,
        licenseFeeCents:
          licenseMaterial && licenseWeightGrams > 0 ? computedLicenseFeeCents : manualLicenseFeeCents,
        licenseMaterial,
        licenseWeightGrams,
        isActive: parsed.data.isActive ?? true
      }
    });

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Produkt konnte nicht aktualisiert werden." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige Produkt-ID.");

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Produkt kann nicht geloescht werden, da es in einem Vordruck verwendet wird." },
      { status: 400 }
    );
  }
}
