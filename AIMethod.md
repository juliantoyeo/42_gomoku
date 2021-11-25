Player put new mark on the board

move_record gets updated

On AI turn:
- get all the adjacent cells from the latest occupied cell (1 cell in all direction surrounding occupied cell)
- if the latest occupied cell is included in the previous adjacent cells, remove this cell from adjacent cells so that this cell will not be scanned again since it is not empty now
- Once new adjacent cells get pushed into the list, removed all the duplicated (previous adjacent cell may be the same with the current adjacent cell)
- save new adjacent on the state for record
- evalute all adjacent cell
- get the block from those adjacent cell, horizontally, vertically, diagonal_1 and diagonal_2
- the get block function will collect all cells starting from adjacent cell, scan 4 cell forward, and 4 cell backward (depends on the direction)
- this is to check if foward and backward 4 cell from this adjacent cell have any potential pattern
- during the collection, if foward/backward cell overlapped with other adjacent cell from the list, this overlapped cell will be included in a list
- all the overlapped cell will be skipped during the next map loop, and the total scanning cell will increase to cover the distance from the skipped overlapped cell
- after collecting all block from all from direction from the adjacent cell list, the evaluation will start
- the evalute function will scanned the block to find matching pattern
- the scanning will start from block + 0, then block + 1, block + 2, until the whole block range is scanned as to not missed any potential pattern 
- since the evalution will try to match the block with alot of pattern, a condition is included to break the matching earlier if the scanned block doesnt not have much chance to match with certain pattern
- the matching of the pattern start from the highest score to the lowest score, and if a match is found, the other pattern will not be scanned anymore to avoid waste
- once a match is found, a node will be created, which contains information like start position of the pattern relative to the board, pattern matched,
owner of the pattern, category of the pattern, direction of the pattern, and the score