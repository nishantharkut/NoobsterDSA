#include <bits/stdc++.h>
using namespace std;
#define ll long long

class Solution {

    public:
    void swap (int &a, int &b){
        int temp = a;
        a = b;
        b = temp;
    }

      void selectionSort(vector<int>& arr, int n)
        {  // Your code goes here
            
            for (int i = 0; i<=n-2;i++){ 
                int minIdx = i; // let the minIdx be the 0th idx
                for (int j = i; j<=n-1;j++){
                    // check if the minIdx is correct or not, if not then find the minElment and set it's idx to be minIdx
                    if (arr[minIdx]>arr[j]) minIdx = j;
                    
                }
                swap(arr[i], arr[minIdx]);
            }
        }
  };

int main() {
    int t;
    cin >> t;
    while (t--) {
        vector<int> arr  = {1,2,3,45,23,124,12,43,5,32,1};
        
        Solution ob;
        ob.selectionSort(arr, arr.size());
        for (int i = 0; i<arr.size();i++){
            cout << arr[i] << " ";
        }
    }
    return 0;
}