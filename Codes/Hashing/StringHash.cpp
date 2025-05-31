#include <bits/stdc++.h>
using namespace std;
#define ll long long

vector<int> PreComputeHash(string s)
{
    vector<int> HashArr(256, 0);
    // for loop for characters, not int
    //  for (int i = 0; i<s.length();i++){
    //      if (s[i] =)
    //  }

    // for each char c in s
    for (auto c : s)
    {
        HashArr[c]++;
    }
    return HashArr;
}

// this is not hashing -> Hashing is precompute and then fetch
//  int stringHashing (string s, char queryy){

//     vector<int> hashArr(26,0);
//     int AsciiValue = queryy;
//     int theCHarAsked = AsciiValue - 'a';
//     for (int i = 0; i<s.length();i++){
//         if (s[i] == queryy){
//             hashArr[theCHarAsked]++;
//         }
//     }
//     return hashArr[theCHarAsked];
// }

int main()
{
    string s;
    cout << "enter the string\n";
    cin >> s;
    int t;
    cin >> t;

    vector<int> thePrecomputedHashArr = PreComputeHash(s);
    while (t--)
    {
        char querryy;
        cout << "enter the query\n";
        cin >> querryy;

        // Fetch
        cout << "the number of " << querryy << " is" << thePrecomputedHashArr[querryy] << endl;
    }

    return 0;
}