def bubbleSort(array):
    isSorted = False
    iteration = 0
    while not isSorted:
        for i in range(len(array) - 1 - iteration):
            if array[i] > array[i+1]:
                swap(i,i+1,array)
                isSorted = False
                iteration += 1
    return array
def swap(i,j,array):
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
arr = [1,3,5,4,2]
bubbleSort(arr)