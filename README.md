# Kobold Library
An extension designed to extend STscript with commands that make use of KCpp's API endpoints.

## Installation:
1. Extensions menu -> `Install extension`.
2. Paste the following in the top textbox:
```
https://github.com/CasualAutopsy/SillyTavern-KoboLib
```
3. Click `Install just for me`.
4. Done. You can now use the new STscript commands.

## New commands
`/kcpp-json-to-grammar`:
***
**Un-named Args**:
1. `{Object}` - JSON Schema

**Returns**: `{String}` - BNF grammar string

Convert JSON Schemas into BNF grammars using Kobold's `/api/extra/json_to_grammar` endpoint.
***

</br>`/ephemeral-bnf`:
***
**Un-named Args**:
1. `{String}` - BNF grammar string

Set the grammar string for the next generation request.
(G/E)BNF Sampler parameters are reset upon finishing a gen request.
***

</br>**With more to come!**
---
