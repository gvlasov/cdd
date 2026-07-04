#!/usr/bin/env bats

load test_helper

@test "install-generated.sh uses the real install binary even when commands/ shadows it on PATH" {
  cd "$PROJECT_ROOT"

  skill_dir="$BATS_TEST_TMPDIR/skills/cdd"
  reference_dir="$skill_dir/references"

  run env PATH="$PROJECT_ROOT/commands:$PATH" timeout 30 \
    ./concepts/agent-skills/install-generated.sh "$skill_dir" "$reference_dir"

  assert_success
  [ -f "$skill_dir/SKILL.md" ]
  [ -f "$reference_dir/concepts.md" ]
}
