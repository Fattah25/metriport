import { z } from "zod";

// https://dev.fitbit.com/build/reference/web-api/user/get-profile/
export const fitbitUserResp = z.object({
  user: z.object({
    age: z.number().optional().nullable(),
    ambassador: z.boolean().optional().nullable(),
    autoStrideEnabled: z.boolean().optional().nullable(),
    avatar: z.string().optional().nullable(),
    avatar150: z.string().optional().nullable(),
    avatar640: z.string().optional().nullable(),
    averageDailySteps: z.number().optional().nullable(),
    challengesBeta: z.boolean().optional().nullable(),
    city: z.string().optional().nullable(),
    clockTimeDisplayFormat: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    corporate: z.boolean().optional().nullable(),
    corporateAdmin: z.boolean().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    displayName: z.string().optional().nullable(),
    displayNameSetting: z.string().optional().nullable(),
    distanceUnit: z.string().optional().nullable(),
    encodedId: z.string().optional().nullable(),
    features: z
      .object({ exerciseGoal: z.boolean().optional().nullable() })
      .optional()
      .nullable(),
    firstName: z.string().optional().nullable(),
    foodsLocale: z.string().optional().nullable(),
    fullName: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    glucoseUnit: z.string().optional().nullable(),
    height: z.number().optional().nullable(),
    heightUnit: z.string().optional().nullable(),
    isBugReportEnabled: z.boolean().optional().nullable(),
    isChild: z.boolean().optional().nullable(),
    isCoach: z.boolean().optional().nullable(),
    languageLocale: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    legalTermsAcceptRequired: z.boolean().optional().nullable(),
    locale: z.string().optional().nullable(),
    memberSince: z.string().optional().nullable(),
    mfaEnabled: z.boolean().optional().nullable(),
    offsetFromUTCMillis: z.number().optional().nullable(),
    sdkDeveloper: z.boolean().optional().nullable(),
    sleepTracking: z.string().optional().nullable(),
    startDayOfWeek: z.string().optional().nullable(),
    strideLengthRunning: z.number().optional().nullable(),
    strideLengthRunningType: z.string().optional().nullable(),
    strideLengthWalking: z.number().optional().nullable(),
    strideLengthWalkingType: z.string().optional().nullable(),
    swimUnit: z.string().optional().nullable(),
    temperatureUnit: z.string().optional().nullable(),
    timezone: z.string().optional().nullable(),
    topBadges: z
      .array(
        z.union([
          z
            .object({
              badgeGradientEndColor: z.string().optional().nullable(),
              badgeGradientStartColor: z.string().optional().nullable(),
              badgeType: z.string().optional().nullable(),
              category: z.string().optional().nullable(),
              cheers: z.array(z.unknown()).optional().nullable(),
              dateTime: z.string().optional().nullable(),
              description: z.string().optional().nullable(),
              earnedMessage: z.string().optional().nullable(),
              encodedId: z.string().optional().nullable(),
              image100px: z.string().optional().nullable(),
              image125px: z.string().optional().nullable(),
              image300px: z.string().optional().nullable(),
              image50px: z.string().optional().nullable(),
              image75px: z.string().optional().nullable(),
              marketingDescription: z.string().optional().nullable(),
              mobileDescription: z.string().optional().nullable(),
              name: z.string().optional().nullable(),
              shareImage640px: z.string().optional().nullable(),
              shareText: z.string().optional().nullable(),
              shortDescription: z.string().optional().nullable(),
              shortName: z.string().optional().nullable(),
              timesAchieved: z.number().optional().nullable(),
              value: z.number().optional().nullable(),
            })
            .optional()
            .nullable(),
          z
            .object({
              badgeGradientEndColor: z.string().optional().nullable(),
              badgeGradientStartColor: z.string().optional().nullable(),
              badgeType: z.string().optional().nullable(),
              category: z.string().optional().nullable(),
              cheers: z.array(z.unknown()).optional().nullable(),
              dateTime: z.string().optional().nullable(),
              description: z.string().optional().nullable(),
              earnedMessage: z.string().optional().nullable(),
              encodedId: z.string().optional().nullable(),
              image100px: z.string().optional().nullable(),
              image125px: z.string().optional().nullable(),
              image300px: z.string().optional().nullable(),
              image50px: z.string().optional().nullable(),
              image75px: z.string().optional().nullable(),
              marketingDescription: z.string().optional().nullable(),
              mobileDescription: z.string().optional().nullable(),
              name: z.string().optional().nullable(),
              shareImage640px: z.string().optional().nullable(),
              shareText: z.string().optional().nullable(),
              shortDescription: z.string().optional().nullable(),
              shortName: z.string().optional().nullable(),
              timesAchieved: z.number().optional().nullable(),
              unit: z.string().optional().nullable(),
              value: z.number().optional().nullable(),
            })
            .optional()
            .nullable(),
        ])
      )
      .optional()
      .nullable(),
    waterUnit: z.string().optional().nullable(),
    waterUnitName: z.string().optional().nullable(),
    weight: z.number().optional().nullable(),
    weightUnit: z.string().optional().nullable(),
  }),
});

export type FitbitUser = z.infer<typeof fitbitUserResp>;
