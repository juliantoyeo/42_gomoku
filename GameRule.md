Win condition :
  5 or more is acceptable (done)
  Capturing 10 stones (or do the capture 5x) (done)
  If the winning row is breakable by a capture and the enemy have already captured 8 stones, it will be invalid (done)

Capture:
  By flanking enemey, we can capture the stone in pairs (only in pairs) (done)

Other rule:
  No creating a double threes (done)
  Cannot move into a capture (done)
  can create a double threes only if the move is to capture enemy stone (done)


Posible time saving:
  if the block contains all empty cell, we skip this block (by checking owner flag)

To do:
  Fix AI second move, now it is too stupid cause only take best_n (done if gameturn < 4, take best 3) (done)