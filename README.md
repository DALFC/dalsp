# DALSP
Repository for the mobile game Date A Live: Spirit Pledge and related contents.
Host the site dalfc.github.io/dalsp
# Spine
A [viewer](https://dalfc.github.io/dalsp/spine) for the game's Spine models, made from the [edited spine-libgdx runtimes](https://github.com/DALFC/spine-runtimes).

Note: All 4 Zadkiel models had to be edited to remove the black matte, because blend modes don't work great with transparent background. You can still find the original sprite in their folders.

Sorry for the bad UI and UX :<. Probably doesn't work on mobile.
# 3.8
The game's spine files (from `hero` and `weapon` folder) converted from 2.1.27 to 3.8 thanks to [spine-gif](https://naganeko.github.io/spine-gif/)

You can use JsonRollback.jar from Spine to downgrade 3.8 to 3.7

Some files don't convert correctly and must be fixed by hand, such files are put inside folders renamed to describe their states
| Suffix  | Meaning |
| ------------- | ------------- |
| \_1  | The game's suffix, nothing to worry about  |
| \_2  | The game's suffix, nothing to worry about  |
| \_3  | The game's suffix, nothing to worry about  |
| \_flipping  | Spine 3 removed the Flip timeline and replaced it with negative Scaling  |
| \_minor  | Minor errors  |
| \_leg  | Error in the leg  |
| \_ik  | IK (Inverse Kinematic) errors  |
| \_texture  | Random texture appeared in view  |
| \_blend  | Blending errors, often happen with shiny effect  |