import { Card } from "@heroui/react";

import { ButtonLink } from "@/components/ui/button-link";
import { Box, Container, Section, Stack } from "@/components/ui/layout";
import {
  BodyText,
  Eyebrow,
  MutedText,
  PageTitle,
  SectionTitle,
  SubsectionTitle,
} from "@/components/ui/typography";

/*
 * Reference page for the design system. Copy these patterns into the
 * dashboard screens:
 *
 * - Layout primitives from @/components/ui/layout (Section, Stack, Box, ...)
 *   instead of raw JSX elements. They wrap HeroUI's `dom.*`, so the markup
 *   keeps its semantic tag without breaking the "no native HTML elements"
 *   rule in DESIGN.md.
 * - Tailwind utility classes for all styling. No CSS files, no style={{}}.
 * - Named typography components instead of <h1>/<p>.
 *
 * The nav bar and footer come from the public layout, so this page is only
 * its own content.
 */

const SERVICES = [
  {
    step: "01",
    title: "Open & scan",
    body: "Staff open the envelope, scan what is inside, and upload it. You read it in the browser minutes later, wherever you are.",
  },
  {
    step: "02",
    title: "Forward",
    body: "Ask for an item to be posted on to any address you choose. Useful for cards, bank documents, and anything you need in your hands.",
  },
  {
    step: "03",
    title: "Shred",
    body: "Junk is destroyed securely, so nothing sensitive sits in a pile. Anything you ignore is shredded automatically after 30 days.",
  },
];

const PROMISES = [
  {
    title: "One login, every mailbox",
    body: "Rent mailboxes in as many cities as you need. They all arrive in the same list, so you never juggle logins.",
  },
  {
    title: "Nothing moves until you say so",
    body: "Asking to scan or shred creates a request. The status changes only once staff have actually done it, so the screen always matches the real world.",
  },
  {
    title: "Mail does not pile up",
    body: "Items are shredded after 30 days unless you ask us to hold them, so your mailbox never turns into a backlog.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Promises />
    </>
  );
}

function Hero() {
  return (
    <Section className="px-6 py-24">
      <Container className="max-w-3xl px-0">
        <Eyebrow>Virtual mailbox</Eyebrow>

        <PageTitle className="mt-4 text-5xl sm:text-6xl">
          Your physical mail, managed like email.
        </PageTitle>

        <BodyText color="muted" className="mt-6 max-w-2xl text-lg">
          Mail arrives at a real street address. We photograph every envelope
          the day it lands, and you decide what happens next — scan it, forward
          it, or shred it — without going near a post box.
        </BodyText>

        <Stack className="mt-10 gap-3 sm:flex-row">
          <ButtonLink href="/signup" variant="primary" size="lg">
            Create account
          </ButtonLink>
          <ButtonLink href="/login" variant="outline" size="lg">
            Sign in
          </ButtonLink>
        </Stack>

        <MutedText className="mt-6">
          Scanned the same day · Shredded securely · Cancel whenever you like
        </MutedText>
      </Container>
    </Section>
  );
}

function Services() {
  return (
    <Section className="border-y border-border bg-background-secondary px-6 py-24">
      <Container className="px-0">
        <Eyebrow>What you can ask for</Eyebrow>
        <SectionTitle className="mt-4 max-w-2xl text-4xl">
          Every envelope, three choices.
        </SectionTitle>

        <Box className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <Card key={service.step} className="h-full">
              <Card.Header>
                <MutedText>{service.step}</MutedText>
                <Card.Title>{service.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <BodyText color="muted">{service.body}</BodyText>
              </Card.Content>
            </Card>
          ))}
        </Box>
      </Container>
    </Section>
  );
}

function Promises() {
  return (
    <Section className="px-6 py-24">
      <Container className="grid gap-12 px-0 md:grid-cols-2">
        <Box>
          <Eyebrow>How it works</Eyebrow>
          <SectionTitle className="mt-4 text-4xl">
            An inbox, but for paper.
          </SectionTitle>
        </Box>

        <Stack className="gap-8">
          {PROMISES.map((promise) => (
            <Box key={promise.title}>
              <SubsectionTitle>{promise.title}</SubsectionTitle>
              <BodyText color="muted" className="mt-2">
                {promise.body}
              </BodyText>
            </Box>
          ))}
        </Stack>
      </Container>
    </Section>
  );
}
