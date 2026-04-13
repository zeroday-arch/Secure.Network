import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { checkVipStatus, getDiscordProfileByUserId } from "./db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { processCheckout, validatePayPalCode, getTestCodes } from "./_core/checkout";
import { sendContactEmail, sendAutoReplyEmail } from "./_core/emailService";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  vip: router({
    checkVipStatus: protectedProcedure.query(async ({ ctx }) => {
      const isVip = await checkVipStatus(ctx.user.id);
      const profile = await getDiscordProfileByUserId(ctx.user.id);
      return {
        isVip,
        profile,
      };
    }),
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getDiscordProfileByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discord profile not found",
        });
      }
      return profile;
    }),
  }),

  checkout: router({
    validateCode: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(({ input }) => {
        return validatePayPalCode(input.code);
      }),
    processCheckout: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          paypalCode: z.string(),
          productName: z.string(),
          productPrice: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return processCheckout(input);
      }),
    getTestCodes: publicProcedure.query(() => {
      return getTestCodes();
    }),
  }),

  contact: router({
    submitForm: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name ist erforderlich"),
          email: z.string().email("Gültige E-Mail erforderlich"),
          subject: z.string().min(1, "Betreff ist erforderlich"),
          message: z.string().min(1, "Nachricht ist erforderlich"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Sende E-Mail an Support-Team
          await sendContactEmail(input);
          // Sende automatische Antwort an Kunden
          await sendAutoReplyEmail(input.email);
          return {
            success: true,
            message: "Deine Nachricht wurde erfolgreich versendet!",
          };
        } catch (error) {
          console.error("Fehler beim Versand der Kontakt-E-Mail:", error);
          return {
            success: false,
            message: "Fehler beim Versand der Nachricht. Bitte versuche es später erneut.",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
