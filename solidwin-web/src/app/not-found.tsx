import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container>
      <div
        style={{
          paddingBlock: "var(--space-9)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: "800",
            color: "var(--color-primary-800)",
          }}
        >
          404
        </span>
        <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "700" }}>
          Page Not Found
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            maxWidth: "46ch",
            fontSize: "var(--text-base)",
          }}
        >
          The page or project you requested could not be located. It may have been moved or updated.
        </p>
        <Button href="/" withArrow>
          Back to Homepage
        </Button>
      </div>
    </Container>
  );
}
