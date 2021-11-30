Win condition :
  5 or more is acceptable (this is done)
  Capturing 10 stones (or do the capture 5x)
  If the winning row is breakable by a capture, it will be invalid

Capture:
  By flanking enemey, we can capture the stone in pairs (only in pairs) (This is done)

Other rule:
  No creating a double threes
  Cannot move into a capture (This is done)


Posible time saving:
  if the block contains all empty cell, we skip this block (by checking owner flag)

To do:
  Fix AI second move, now it is too stupid cause only take best_n (done if gameturn < 4, take best 3)