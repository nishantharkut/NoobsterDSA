#include <bits/stdc++.h>
using namespace std;
#define ll long long 

void ArrKaInputLele(vector<int> &arr, int n) {
    arr.resize(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
}

//precompute
map<ll,ll> preComputeHash(vector<int> arr){
    map<ll,ll> mpp;
    for (auto x : arr){
        mpp[x]++;
    }
    return mpp;
}

void MapIteration(const map<ll,ll>& mpp){
    for (auto it : mpp){
        cout << it.first << " --> " << it.second << endl;
    }
}

int main() {
    vector<int> arr(10);
    cout << "enter your array\n";
    ArrKaInputLele(arr,10);
    map<ll,ll> HashedArr = preComputeHash(arr);

    //all frequencies:
        cout << "all the frequencies are:" << endl;
        MapIteration(HashedArr);
    int t;
    cout << "enter the test cases\n";
    cin >> t;
    while (t--) {
        int query;
        cout << "enter query\n";
        cin >> query;
        
        
        //fetch
        cout << "the frequency of " << query << "is : " << HashedArr[query] << endl;  
    }
}
