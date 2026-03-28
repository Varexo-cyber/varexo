---
description: Check translation completeness across the codebase
---

# Translation Completeness Check Workflow

This workflow helps ensure all text in the application is properly translated.

## Steps

1. **Check LanguageContext.tsx for completeness**
   - Verify both NL and EN sections have the same keys
   - Look for missing keys in either language
   - Check for hardcoded strings instead of translation keys

2. **Scan Admin.tsx for hardcoded text**
   - Search for inline conditionals like `t('language') === 'nl' ? 'Dutch' : 'English'`
   - Replace with proper translation keys: `t('admin.finance.totalRevenue')`
   - Check for hardcoded button labels, headers, and descriptions

3. **Scan Dashboard.tsx for hardcoded text**
   - Check project status labels
   - Verify invoice status translations
   - Look for untranslated button text

4. **Scan Profile.tsx for hardcoded text**
   - Check form labels
   - Verify error messages
   - Look for untranslated placeholders

5. **Check backend email templates**
   - Verify all email functions use bilingual content
   - Check that `sendPasswordResetEmail` and other functions pass the language parameter
   - Ensure all email subjects and body content are translated

6. **Common patterns to fix**
   - Replace `{t('language') === 'nl' ? 'X' : 'Y'}` with `{t('key')}`
   - Add missing translation keys to LanguageContext.tsx
   - Ensure consistency across all components

7. **Test translations**
   - Switch language to NL and verify all text is Dutch
   - Switch language to EN and verify all text is English
   - Check that no translation keys (like `admin.expenses`) appear as literal text

## Command to search for untranslated text

```bash
# Search for hardcoded Dutch/English in TSX files
grep -r "t('language') === 'nl'" src/pages/
grep -r "Annuleren\|Bewerken\|Verwijderen" src/pages/
grep -r "Nieuwe\|Selecteer" src/pages/
```
