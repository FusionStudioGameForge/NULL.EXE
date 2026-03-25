// src/utils/DialogMixin.js
// =============================================
// Shared dialog/narrative helpers for all scenes.
// Previously copy-pasted into every scene file —
// centralising here removes ~50 lines of duplication
// per scene and ensures consistent advance-guard logic.
// =============================================

import { COLORS } from '../utils/constants.js';

/**
 * Call applyDialogMixin(SceneClass.prototype) after each class definition,
 * or extend a base class that already has these methods.
 *
 * Usage inside a scene:
 *   this._showDialog(speaker, text, color, onDone, duration);
 *   this._showNarrativeLines(linesArray, onComplete);
 */
export function applyDialogMixin(proto) {
    /**
     * Shows a single dialog box.
     *
     * FIX 1: Switched from this.input.once() + this.input.off() to
     *         this.input.on() + this.input.off(). Using `once` creates an
     *         internal Phaser wrapper that can't be matched by a later `off`
     *         call — meaning if the timer fires first the click listener leaks
     *         and fires on the very next unrelated pointer event.
     *         Using `on` + explicit `off` inside `advance` removes it cleanly.
     *
     * FIX 2: Added a no-op default for onDone so fire-and-forget callers
     *         (passing no callback) don't throw "onDone is not a function".
     */
    proto._showDialog = function(speaker, text, color, onDone = () => {}, duration = 2800) {
        if (this._dialogBox) this._dialogBox.destroy();

        const box = this.add.container(640, 630).setDepth(60);
        const bg  = this.add.rectangle(0, 0, 900, 90, 0x000000, 0.82)
            .setStrokeStyle(1, 0x888888, 1); // FIX 5: explicit alpha arg for clarity
        const txt = this.add.text(0, speaker ? 10 : 0, text, {
            fontSize: '22px',
            fill: color || COLORS.WHITE,
            align: 'center',
            wordWrap: { width: 860 },
        }).setOrigin(0.5);

        const children = [bg, txt];
        if (speaker) {
            children.push(
                this.add.text(0, -30, speaker, {
                    fontSize: '16px', fill: COLORS.GOLD, fontStyle: 'italic',
                }).setOrigin(0.5)
            );
        }
        box.add(children);
        this._dialogBox = box;

        // Double-fire guard: click and timer must not both invoke onDone.
        let advanced = false;
        const advance = () => {
            if (advanced) return;
            advanced = true;
            if (this._dialogBox) { this._dialogBox.destroy(); this._dialogBox = null; }
            // FIX 1: `off` correctly removes the `on` listener by reference.
            this.input.off('pointerdown', advance);
            onDone();
        };

        // FIX 1: Use `on` (not `once`) so `off` can reliably remove it.
        this.input.on('pointerdown', advance);
        this.time.delayedCall(duration, advance);
    };

    /**
     * Steps through an array of { speaker?, text, color? } objects *or*
     * plain strings, calling onComplete when the last line is dismissed.
     *
     * FIX 3: Normalise each item explicitly before accessing properties so
     *         that plain strings, objects with a falsy `text`, and missing
     *         fields are all handled without silent failures.
     *
     * FIX 2 (related): Removed the now-redundant `this._dialogBox` cleanup
     *         at the end of the loop — `_showDialog` already destroys and
     *         nulls `_dialogBox` before calling the `onDone` callback, so
     *         the guard here would never have matched anyway.
     */
    proto._showNarrativeLines = function(lines, onComplete) {
        let i = 0;
        const showNext = () => {
            if (i >= lines.length) {
                onComplete(); // _dialogBox already cleaned up by _showDialog
                return;
            }

            // FIX 3: Normalise plain strings into the object shape so that
            //         property accesses below are always safe.
            const raw  = lines[i++];
            const line = (typeof raw === 'string') ? { text: raw } : raw;

            this._showDialog(
                line.speaker || null,
                line.text    || '',
                line.color   || COLORS.WHITE,
                showNext,
                2400
            );
        };
        showNext();
    };
}
