import { RRule, RRuleSet } from "rrule";
import moment from 'moment'

export default function scheduleDateLists(dateStart, plan) {
  const rruleSet = new RRuleSet();
  const yearUTC = new Date(dateStart).getUTCFullYear();
  const dayUTC = new Date(dateStart).getUTCDate();
  const monthUTC = new Date(dateStart).getUTCMonth();
  let options = { freq: RRule.WEEKLY };

  if (plan && plan.recurrence === "Weekly") options = { freq: RRule.WEEKLY };
  if (plan && plan.recurrence === "Fortnightly") options = { freq: RRule.WEEKLY, interval: 2 };
  if (plan && plan.recurrence === "Monthly") options = { freq: RRule.MONTHLY };

  rruleSet.rrule(
    new RRule({
      ...options,
      count: plan && (plan.quantity || 0),
      dtstart: new Date(Date.UTC(yearUTC, monthUTC, dayUTC, 0, 0)),
    })
  );
  return rruleSet.all().map((date) => {
    return { 
      date: moment(date).format('YYYY-MM-DD'),
    };
  });
}